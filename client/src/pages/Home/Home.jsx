import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { loginUser } from "../../actions/app.actions";
import Form from "../../components/Form";
import { useHttp } from "../../hooks/http.hook";
import { loginedSelector, userSelector } from "../../selectors/app.selectors";
import "./Home.styles.scss";




function Home({ logined, loginUser, user, socket }) {

    const { loading, request, error, clearError } = useHttp();
    const [totalConnections, setTotalConnections] = useState(0);

    useEffect(function() {
        socket.on("joinServer", ({ clients }) => {
            console.log("joinServer", clients);

            setTotalConnections(clients.map(client => client.name).join(", "));
        });
        socket.on("leaveServer", ({ clients }) => {
            console.log("leaveServer", clients);
            setTotalConnections(clients.map(client => client.name).join(", "));
        });
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

    return (
        <div className="Home">
            <div className="Home__header">
                {/* <div className="Home__header-item">
                    Connected status:{" "}
                    <span className={`Home__header-item-status ${isConnected ? "is-success" : "is-failure"}`}>
                        {isConnected ? "online" : "offline"}
                    </span>
                </div> */}
                <div className="Home__header-item">Total connections: {totalConnections}</div>
            </div>
            {!logined && (
                <div className="Home__form">
                    <Form action={handleFormSubmit} clearError={clearError} serverError={error} loading={loading} />
                </div>
            )}

            {logined && (
                <div>
                    <h1 style={{ color: "white" }}>Hello1, {user.name}</h1>
                </div>
            )}
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
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
