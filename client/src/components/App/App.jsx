import React, { useEffect } from "react";
import { connect } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import { getData } from "../../actions/app.actions";
import { RoutesContainer } from "../../Routes";
import Loader from "../Loader";
import "./App.styles.scss";

function App({ isAppLoading, isAuth, getData }) {
    useEffect(() => {
        getData();
    }, [getData]);

    return (
        <div className={`App ${isAppLoading ? "is-loading" : "is-loaded"}`}>
            <div className="App__wrapper">
                <Loader shown={isAppLoading} />

                {!isAppLoading && (
                    <Router>
                        <RoutesContainer isAuth={isAuth} />
                    </Router>
                )}
            </div>
        </div>
    );
}

const mapStateToProps = state => ({
    isAppLoading: state.app.isAppLoading,
    isAuth: state.app.isAuth,
});
const mapDispatchToProps = dispatch => ({
    getData: () => dispatch(getData()),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
