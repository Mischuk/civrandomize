import React from "react";
import "./Loader.styles.scss";

function Loader({ shown }) {
    if ( !shown ) return null;

    return <div className="Loader">
        <div className="Loader__text">
            Loading
            <i>.</i>
            <i>.</i>
            <i>.</i>
        </div>
    </div>
}

export default Loader;