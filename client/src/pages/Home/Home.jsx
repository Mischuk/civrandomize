import React, { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import { CSSTransition } from "react-transition-group";
import { loginUser, logoutUser, setField } from "../../actions/app.actions";
import Form from "../../components/Form";
import RandomSpinner from "../../components/RandomSpinner/RandomSpinner";
import Users from "../../components/Users/Users";
import socket from "../../core/socket";
import { useHttp } from "../../hooks/http.hook";
import { loginedSelector, userSelector } from "../../selectors/app.selectors";
import "./Home.styles.scss";

function useTraceUpdate(props) {
    const prev = useRef(props);
    useEffect(() => {
        const changedProps = Object.entries(props).reduce((ps, [k, v]) => {
            if (prev.current[k] !== v) {
                ps[k] = [prev.current[k], v];
            }
            return ps;
        }, {});
        if (Object.keys(changedProps).length > 0) {
            console.log("Changed props:", changedProps);
        }
        prev.current = props;
    });
}

function Home(props) {
    useTraceUpdate(props);

    const { logined, loginUser, user, logoutUser, updateBannedNations, updateCurrentCounter, runGame, runGameStatus, updateRandomedIds, randomedIds } = props;
    const { loading, request, error, clearError } = useHttp();
    const [users, setUsers] = useState([]);
    const [showUsers, setShowUsers] = useState(false);
    const [showForm, setShowForm] = useState(true);
    const [showRandomSpinner, setShowRandomSpinner] = useState(false);

    useEffect(() => {
        const updateUsers = data => {
            setUsers(
                data.map(client => ({
                    name: client.name,
                    status: client.status,
                    id: client.id,
                })),
            );
        };

        socket.on("joinServer", ({ clients }) => {
            console.log("Join server", clients);
            updateUsers(clients);
        });
        socket.on("leaveServer", ({ clients }) => {
            console.log("Leave server", clients);
            updateUsers(clients);
        });
        socket.on("userUpdateStatusServer", ({ clients }) => {
            console.log("Update user status", clients);
            updateUsers(clients);
        });
        socket.on("banNationsServer", ({ bannedNations }) => {
            console.log(`banNationsServer: `);
            updateBannedNations(bannedNations);
        });
        socket.on("updateCounterServer", ({ currentCounter }) => {
            console.log(`updateCounterServer: `, currentCounter);
            updateCurrentCounter(currentCounter);
        });
        socket.on("startGameServer", () => {
            runGame(true);
        });
        socket.on("sendRandomedServer", ({randomedIds}) => {
            console.log(`sendRandomedServer: `, randomedIds);
            if ( user ) {

                let filtered = randomedIds.filter(item => item.username === user.name);
                updateRandomedIds(filtered.ids);
            }
        });
    }, [updateBannedNations, updateCurrentCounter, runGame, user, updateRandomedIds]);

    const loginHandler = async body => {
        try {
            const data = await request("/api/auth/login", "POST", body);

            if (data) {
                loginUser(data);
                socket.emit("joinClient", data);
            }
        } catch (error) {}
    };

    const registerHandler = async body => {
        try {
            const data = await request("/api/auth/register", "POST", body);
            const { user } = data;
            loginHandler(user);
        } catch (error) {}
    };

    const handleFormSubmit = (type, value) => {
        if (type === "signup") {
            registerHandler(value);
        }

        if (type === "signin") {
            loginHandler(value);
        }
    };

    const handleLogOut = () => {
        socket.emit("leaveClient");
        logoutUser();
        setShowUsers(false);
        setShowForm(false);
    };

    return (
        <div className="Home">
            <CSSTransition
                in={!logined && showForm}
                timeout={500}
                onExited={() => setShowUsers(true)}
                classNames="display"
                appear
                unmountOnExit>
                <div className="Home__form">
                    <Form action={handleFormSubmit} clearError={clearError} serverError={error} loading={loading} />
                </div>
            </CSSTransition>
            <CSSTransition
                in={logined && showUsers && !runGameStatus}
                onExited={() => {setShowForm(true); setShowRandomSpinner(true);}}
                timeout={500}
                classNames="display"
                appear
                unmountOnExit>
                <div className="Home__users">
                    <Users leave={handleLogOut} currentUser={user} users={users} />
                </div>
            </CSSTransition>
            <CSSTransition in={runGameStatus && showRandomSpinner} timeout={500} classNames="display"
                appear
                unmountOnExit>
                <div>
                <RandomSpinner />
                </div>
            </CSSTransition>
        </div>
    );
}
const mapStateToProps = state => {
    return {
        logined: loginedSelector(state),
        user: userSelector(state),
        runGameStatus: state.app.runGame,
        randomedIds: state.app.randomedIds,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        loginUser: data => dispatch(loginUser(data)),
        logoutUser: () => dispatch(logoutUser()),
        updateBannedNations: value => dispatch(setField("bannedIds", value)),
        updateCurrentCounter: value => dispatch(setField("currentCounter", value)),
        runGame: value => dispatch(setField("runGame", value)),
        updateRandomedIds: value => dispatch(setField("randomedIds", value)),
    };
};

export default React.memo(connect(mapStateToProps, mapDispatchToProps)(Home));
