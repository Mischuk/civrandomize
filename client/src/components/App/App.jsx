import React, { useEffect } from "react";
import { connect } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import { getData } from "../../actions/app.actions";
import { RoutesContainer } from "../../Routes";
import Loader from "../Loader";
import "./App.styles.scss";


function App({ loading, getData }) {
    useEffect(() => {
        getData();
    }, [getData]);

    return (
        <div className={`App ${loading ? "is-loading" : "is-loaded"}`}>
            <div className="App__wrapper">
                <Loader shown={loading} />

                {!loading && (
                    <Router>
                        <RoutesContainer  />
                    </Router>
                )}
            </div>
        </div>
    );
}

const mapStateToProps = state => ({
    loading: state.app.loading
});

const mapDispatchToProps = dispatch => {
    return {
        getData: () => dispatch(getData())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
