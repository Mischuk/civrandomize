import React, { useState } from "react";
import { FaAngleDoubleLeft, FaAngleDoubleRight } from "react-icons/fa";
import useTraceUpdate from "use-trace-update";
import socket from "../../core/socket";
import Modal from "../Modal/Modal";
import NationsBan from "../NationsBan/NationsBan";
import RoomSettings from "../RoomSettings/RoomSettings";
import UsersActions from "../UsersActions/UsersActions";
import UsersList from "../UsersList/UsersList";
import "./Users.styles.scss";

const Users = (props) => {
    useTraceUpdate(props);
    const { currentUser, leave } = props;

    const [showMenu, setShowMenu] = useState(false);
    const [showModal, setShowModal] = useState(false);

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
                        <UsersList currentUser={currentUser} toggleReadyStatus={toggleReadyStatus} setShowModal={setShowModal} />
                    </div>
                </div>
                <div className={`Users__column Users__column--sidebar ${showMenu ? "is-open": "is-closed"}`}>
                    <RoomSettings />
                </div>
            </div>
            <div className="Users__footer">
                <UsersActions leave={leave}/>
            </div>
            <Modal onClose={() => setShowModal(false)} title="Nations to ban" isOpen={showModal}>
                <NationsBan />
            </Modal>
        </div>
    );
};

export default Users;
