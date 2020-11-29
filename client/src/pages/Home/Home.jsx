import React from "react";
import { connect } from "react-redux";
import { loginUser } from "../../actions/app.actions";
import Form from "../../components/Form";
import { useHttp } from "../../hooks/http.hook";
import { userAuthSelector } from "../../selectors/app.selectors";
import "./Home.styles.scss";

function Home({ isAuth, loginUser, userName }) {
    const { loading, request, error, clearError } = useHttp();

    const loginHandler = async body => {
        try {
            const data = await request("/api/auth/login", "POST", body);

            if (data) {
                loginUser(data);
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
            {!isAuth && (
                <div className="Home__form">
                    <Form action={handleFormSubmit} clearError={clearError} serverError={error} loading={loading} />
                </div>
            )}

            {isAuth && (
                <div>
                    <h1 style={{ color: "white" }}>Hello, {userName}</h1>
                </div>
            )}
        </div>
    );
}
const mapStateToProps = state => {
    return {
        isAuth: userAuthSelector(state),
        userName: state.app.userName,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        loginUser: userData => dispatch(loginUser(userData)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
