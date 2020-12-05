import React, { useEffect, useState } from "react";
import { AiOutlineSync } from "react-icons/ai";
import { connect } from "react-redux";
import socket from "../../core/socket";
import Button from "../Button";

const UsersActions = props => {
    const { users, leave, tryAgain } = props;
    const [allReady, setAllReady] = useState(false);

    useEffect(() => {
        let failureStatus = users.find(({ status }) => status === false);
        setAllReady(!failureStatus);
    }, [users]);

    const startGame = () => {
        socket.emit("startGameClient");
    };

    return (
        <>
            {!tryAgain && <div className="Users__action Users__action--small">
                <Button action={leave}>Leave</Button>
            </div> }
            <div className="Users__action">
                <Button action={startGame} disabled={!allReady}>
                    {tryAgain ? <AiOutlineSync style={{fontSize: "36px"}} /> : "Start"}
                </Button>
            </div>
        </>
    );
};

const mapStateToProps = state => {
    return {
        users: state.app.users,
    };
};

export default connect(mapStateToProps, null)(UsersActions);
