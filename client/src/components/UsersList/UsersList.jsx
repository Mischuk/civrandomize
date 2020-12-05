import React from "react";
import { GiBeaver } from "react-icons/gi";
import { connect } from "react-redux";
import Checkbox from "../Checkbox";

const UsersList = (props) => {
    const { users, currentUser, toggleReadyStatus, setShowModal } = props;
    return (
        <>
            {users.length > 0 &&
                users.map(user => {
                    const current = currentUser ? user.name === currentUser.name : false;
                    return (
                        <div key={user.id} className={`Users__item ${user.status ? "is-ready" : "is-wait"}`}>
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
        </>
    );
};

const mapStateToProps = state => {
    return {
        users: state.app.users,
    };
};


export default connect(mapStateToProps, null)(UsersList);