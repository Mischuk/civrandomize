import React from "react";
import { FaCogs } from "react-icons/fa";
import Button from "../Button";
import Checkbox from "../Checkbox";
import "./Users.styles.scss";

const Users = ({ users = [], currentUser, leave, socket }) => {
    console.log(`users: `, users);
    const toggleReadyStatus = value => {
        socket.emit("userUpdateStatusClient", value);
    };

    return (
        <div className="Users">
            <div className="Users__header">Waiting room...</div>
            <div className="Users__body">
                <div className="Users__column">
                    <div className="Users__players">
                        {users.length > 0 &&
                            users.map(user => {
                                const current = currentUser ? user.name === currentUser.name : false;
                                return (
                                    <div
                                        key={user.id}
                                        className={`Users__item ${user.status ? "is-ready" : "is-wait"}`}>
                                        <div className="Users__item-name">{user.name}</div>
                                        <div className="Users__item-actions">
                                            {current && (
                                                <>
                                                    <div className="Users__item-action">
                                                        <div className="Users__bans">
                                                            <FaCogs />
                                                        </div>
                                                    </div>

                                                    <div className="Users__item-action">
                                                        <Checkbox value={user.status} onUpdate={toggleReadyStatus} />
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                    </div>
                </div>
                <div className="Users__column">Room settings</div>
            </div>
            <div className="Users__footer">
                <div className="Users__action">
                    <Button action={leave}>Leave</Button>
                </div>
                <div className="Users__action">
                    <Button
                        action={() => {
                            console.log("Start game");
                        }}
                        disabled={true}>
                        Start
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Users;
