import React from "react";
import "./Button.styles.scss";

const Button = ({ children, action, disabled, loading }) => (
    <button disabled={disabled} className="Button" type="submit" onClick={action}>
        <div className="Button__text">
            {!loading && children}
            {loading && <span className="Button__loading">Loading<i>.</i><i>.</i><i>.</i></span>}
        </div>
    </button>
);

export default Button;
