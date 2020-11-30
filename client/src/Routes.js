import React, { useEffect } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import Home from "./pages/Home";

const Page = (Page, title, socket) => {
    useEffect(() => {
        document.title = title;
    }, [title]);

    return props => <Page {...props} socket={socket}/>;
};

export const Routes = {
    Home: "/",
};


export const RoutesContainer = ({logined, socket}) => {
    return (
        <Switch>
            <Route exact path={Routes.Home} component={Page(Home, "Home title", socket)}></Route>
            <Redirect to={Routes.Home} />
        </Switch>
    )
}