import React, { useEffect, useState } from "react";
import { FaAngleDoubleLeft, FaAngleDoubleRight } from "react-icons/fa";
import { GiBeaver } from "react-icons/gi";
import socket from "../../core/socket";
import Button from "../Button";
import Checkbox from "../Checkbox";
import Modal from "../Modal/Modal";
import NationsBan from "../NationsBan/NationsBan";
import RoomSettings from "../RoomSettings/RoomSettings";
import "./Users.styles.scss";

const Users = ({ users = [], currentUser, leave }) => {
    const [allReady, setAllReady] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        let failureStatus = users.find(({status}) => status === false);
        setAllReady(failureStatus);
    }, [users]);

    const toggleReadyStatus = value => {
        socket.emit("userUpdateStatusClient", value);
    };

    return (
        <div className="Users">
            <div className="Users__header">
                <div className="Users__header-title">Waiting room...</div>
                <div className="Users__header-actions">
                    <div className="Users__header-action" onClick={() => setShowMenu(!showMenu)}>
                        {showMenu ? <FaAngleDoubleRight/> : <FaAngleDoubleLeft/>}
                    </div>
                </div>
            </div>
            <div className={`Users__body ${showMenu ? "has-backdrop": ""}`}>
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
                                                        <div className="Users__bans" onClick={() => setShowModal(true)}>
                                                            <GiBeaver />
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
                <div className={`Users__column Users__column--sidebar ${showMenu ? "is-open": "is-closed"}`}>
                    <RoomSettings />
                </div>
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
                        disabled={allReady}>
                        Start
                    </Button>
                </div>
            </div>
            <Modal onClose={() => setShowModal(false)} title="Nations to ban" isOpen={showModal}>
                <NationsBan />
            </Modal>
        </div>
    );
};

export default Users;
