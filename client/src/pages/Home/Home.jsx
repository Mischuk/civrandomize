import React, { useCallback, useEffect, useState } from "react";
import { connect } from "react-redux";
import { CSSTransition } from "react-transition-group";
import useTraceUpdate from "use-trace-update";
import { loginUser, logoutUser, setField } from "../../actions/app.actions";
import ChooseNation from "../../components/ChooseNation/ChooseNation";
import Form from "../../components/Form";
import RandomSpinner from "../../components/RandomSpinner/RandomSpinner";
import Users from "../../components/Users/Users";
import socket from "../../core/socket";
import { useHttp } from "../../hooks/http.hook";
import { loginedSelector, userSelector } from "../../selectors/app.selectors";
import "./Home.styles.scss";

function Home(props) {
    const {
        logined,
        loginUser,
        user,
        logoutUser,
        updateBannedNations,
        updateCurrentCounter,
        runGame,
        runGameStatus,
        updateRandomedIds,
        gameIds,
        updateSelectedNations,
        updateStateUsers,
        showNationsSpinner
    } = props;

    useTraceUpdate(props);

    const { loading, request, error, clearError } = useHttp();
    const [showUsers, setShowUsers] = useState(false);
    const [showForm, setShowForm] = useState(true);
    const [showRandomSpinner, setShowRandomSpinner] = useState(false);
    const [chooseView, setChooseView] = useState(false);

    useEffect(() => {
        const updateUsers = data => {
            updateStateUsers(data.map(client => ({
                name: client.name,
                status: client.status,
                id: client.id,
            })))
        };

        socket.on("joinServer", ({ clients }) => {
            updateUsers(clients);
        });
        socket.on("leaveServer", ({ clients }) => {
            updateUsers(clients);
        });
        socket.on("userUpdateStatusServer", ({ clients }) => {
            updateUsers(clients);
        });
        socket.on("banNationsServer", ({ bannedNations }) => {
            updateBannedNations(bannedNations);
        });
        socket.on("updateCounterServer", ({ currentCounter }) => {
            updateCurrentCounter(currentCounter);
        });
        socket.on("startGameServer", () => {
            console.log(`startGameServer: `);
            runGame(true);
            showNationsSpinner(true);
        });
        socket.on("sendRandomedServer", ({ randomedIds }) => {
            updateRandomedIds(randomedIds);
            updateSelectedNations([]);
            showNationsSpinner(false);
        });
        socket.on("selectNationServer", ({ selectedNations }) => {
            updateSelectedNations(selectedNations);
        });
    }, [updateBannedNations, updateCurrentCounter, runGame, user, updateRandomedIds, updateSelectedNations, updateStateUsers, showNationsSpinner]);

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

    const handleLogOut = useCallback(() => {
        socket.emit("leaveClient");
        logoutUser();
        setShowUsers(false);
        setShowForm(false);
    }, [logoutUser]);

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
                onExited={() => {
                    setShowForm(true);
                    setShowRandomSpinner(true);
                }}
                timeout={500}
                classNames="display"
                appear
                unmountOnExit>
                <div className="Home__users">
                    <Users leave={handleLogOut} currentUser={user} />
                </div>
            </CSSTransition>
            <CSSTransition
                in={runGameStatus && showRandomSpinner && gameIds.length === 0}
                timeout={500}
                classNames="display"
                appear
                onExited={() => {
                    setChooseView(true);
                }}
                unmountOnExit>
                <div>
                    <RandomSpinner />
                </div>
            </CSSTransition>
            <CSSTransition
                in={chooseView && gameIds.length > 0}
                timeout={500}
                classNames="display"
                appear
                unmountOnExit>
                <ChooseNation gameIds={gameIds} currentUser={user} />
            </CSSTransition>
        </div>
    );
}
const mapStateToProps = state => {
    return {
        logined: loginedSelector(state),
        user: userSelector(state),
        runGameStatus: state.app.runGame,
        gameIds: state.app.randomedIds,
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
        updateSelectedNations: value => dispatch(setField("selectedNationsGlobal", value)),
        updateStateUsers: value => dispatch(setField("users", value)),
        showNationsSpinner: value => dispatch(setField("showNationsSpinner", value)),
    };
};

export default React.memo(connect(mapStateToProps, mapDispatchToProps)(Home));
