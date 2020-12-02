import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { CSSTransition } from "react-transition-group";
import { loginUser, logoutUser } from "../../actions/app.actions";
import Form from "../../components/Form";
import Users from "../../components/Users/Users";
import { useHttp } from "../../hooks/http.hook";
import { loginedSelector, userSelector } from "../../selectors/app.selectors";
import "./Home.styles.scss";

function Home({ logined, loginUser, user, socket, logoutUser }) {
    const { loading, request, error, clearError } = useHttp();
    const [users, setUsers] = useState([]);
    const [showUsers, setShowUsers] = useState(false);
    const [showForm, setShowForm] = useState(true);



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
        socket.on("userUpdateStatusServer", ({clients}) => {
            console.log("Update user status", clients);
            updateUsers(clients);
        })
    }, [socket]);

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
    }

    return (
        <div className="Home">
                <CSSTransition in={!logined && showForm} timeout={500} onExited={() => setShowUsers(true)} classNames="display" appear unmountOnExit>
                    <div className="Home__form">
                        <Form action={handleFormSubmit} clearError={clearError} serverError={error} loading={loading} />
                    </div>
                </CSSTransition>
                <CSSTransition in={logined && showUsers} onExited={() => setShowForm(true)} timeout={500} classNames="display" appear unmountOnExit>
                    <div className="Home__users">
                        <Users socket={socket} leave={handleLogOut} currentUser={user} users={users} />
                    </div>
                </CSSTransition>

        </div>
    );
}
const mapStateToProps = state => {
    return {
        logined: loginedSelector(state),
        user: userSelector(state),
    };
};

const mapDispatchToProps = dispatch => {
    return {
        loginUser: data => dispatch(loginUser(data)),
        logoutUser: () => dispatch(logoutUser()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
