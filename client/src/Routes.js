import React, { useEffect } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import Home from "./pages/Home";

const Page = (Page, title) => {
    useEffect(() => {
        document.title = title;
    }, [title]);

    return props => <Page {...props} />;
};

export const Routes = {
    Home: "/",
};


export const RoutesContainer = ({isAuth}) => {
    return (
        <Switch>
            <Route exact path={Routes.Home} component={Page(Home, "Home title")}></Route>
            <Redirect to={Routes.Home} />
        </Switch>
    )
}