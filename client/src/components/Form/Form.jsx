import React, { useCallback, useEffect, useState } from "react";
import Button from "../Button";
import "./Form.styles.scss";

const Form = ({ action, loading, serverError, clearError }) => {
    const [showSignUp, setShowSignUp] = useState(false);
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [errorFromServer, setErrorFromServer] = useState(null);

    useEffect(() => {
        setIsLoading(loading);
    }, [loading]);

    useEffect(() => {
        setErrorFromServer(serverError);
    }, [serverError]);

    const resetForm = useCallback(() => {
        setPassword("");
        setName("");
        setError([]);
    }, []);

    useEffect(() => {
        resetForm();
        clearError();

        return () => {
            resetForm();
        };
    }, [showSignUp, resetForm, clearError]);

    const handleSubmit = e => {
        e.preventDefault();

        setError([]);
        clearError();

        let localErrors = [];

        if (!name.length) {
            localErrors.push({ field: "name", message: "Name is required field!" });
        }

        if (!password.length) {
            localErrors.push({ field: "password", message: "Password is required field!" });
        }

        setError(localErrors);

        if (name.length && password.length) {
            action(showSignUp ? "signup" : "signin", { name, password });
        }
    };

    const handleInputChange = (value, fn, type = null) => {
        const copyError = [...error];

        let removeIndex = copyError.map(item => item.field).indexOf(type);
        if (removeIndex >= 0) {
            copyError.splice(removeIndex, 1);
            setError(copyError);
        }

        fn(value);
    };

    return (
        <form className="Form">
            <div className="Form__row">
                <h1 className="Form__title">{showSignUp ? "Registration" : "Login"}</h1>
            </div>

            {error.length > 0 && (
                <div className="Form__row">
                    {error.map((item, idx) => (
                        <div key={idx} className="Form__error">
                            {item.message}
                        </div>
                    ))}
                </div>
            )}

            {errorFromServer && (
                <div className="Form__row">
                    <div className="Form__error">{errorFromServer}</div>
                </div>
            )}

            <div className="Form__row">
                <input
                    className={`Form__input ${isLoading ? "is-loading" : ""} ${
                        error.find(item => item.field === "name") ? "has-error" : ""
                    }`}
                    type="text"
                    placeholder="Name"
                    spellCheck="false"
                    value={name}
                    disabled={isLoading}
                    onChange={e => handleInputChange(e.target.value, setName, "name")}
                />
            </div>

            <div className="Form__row">
                <input
                    className={`Form__input ${isLoading ? "is-loading" : ""} ${
                        error.find(item => item.field === "password") ? "has-error" : ""
                    }`}
                    type="password"
                    placeholder="Password"
                    spellCheck="false"
                    value={password}
                    disabled={isLoading}
                    onChange={e => handleInputChange(e.target.value, setPassword, "password")}
                />
            </div>

            <div className="Form__row">
                <div className="Form__button">
                    <Button disabled={isLoading} loading={isLoading} action={handleSubmit}>
                        {showSignUp ? "Sign up" : "Sign in"}
                    </Button>
                </div>
                <div
                    onClick={() => !isLoading && setShowSignUp(!showSignUp)}
                    className={`Form__toggle ${isLoading ? "is-loading" : ""} ${
                        showSignUp ? "is-signup" : "is-signin"
                    }`}>
                    {showSignUp ? "Already have an account?" : "Don't have an account?"}
                </div>
            </div>
        </form>
    );
};

export default Form;
