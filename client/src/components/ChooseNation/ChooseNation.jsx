import React, { useState } from "react";
import { connect } from "react-redux";
import socket from "../../core/socket";
import Button from "../Button";
import "./ChooseNation.scss";

const ChooseNation = ({ gameIds, currentUser, data, selected }) => {
    console.log(`selected: `, selected);
    const getCurrentUserIds = gameIds.find(({ username }) => username === currentUser.name).ids;
    const nations = data.filter(f => getCurrentUserIds.includes(f.id));
    const [selectedId, setSelectedId] = useState(null);
    const [submited, setSubmited] = useState(false);

    const handleSelect = id => {
        setSelectedId(id);
    };

    const handleSubmit = () => {
        setSubmited(true);
        socket.emit("selectNationClient", { name: currentUser.name, selectedId });
    };

    const renderView = id => {
        const currentNation = data.find(item => item.id === id);
        return (
            <div className="ChooseNation__selected-nation">
                <div className="ChooseNation__selected-nation-name">{currentNation.name} </div>
                <div className="ChooseNation__selected-nation-image">
                    <img src={currentNation.image} alt="" />
                </div>
            </div>
        );
    };

    return (
        <div className="ChooseNation">
            {submited && (
                <div className="ChooseNation__selected">
                    {gameIds.map(el => {
                        return (
                            <div key={el.username} className="ChooseNation__selected-item">
                                <div className="ChooseNation__selected-username">{el.username}</div>

                                {selected.find(user => user.name === el.username) && (
                                    <>
                                        <div className="ChooseNation__selected-username">plays on</div>
                                        {renderView(selected.find(user => user.name === el.username).selectedId)}
                                    </>
                                )}
                                {!selected.find(user => user.name === el.username) && (
                                    <div className="ChooseNation__loader">
                                        <div className="ChooseNation__loader-text">
                                            still thinking
                                            <i>.</i>
                                            <i>.</i>
                                            <i>.</i>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
            {!submited && (
                <>
                    <div className="ChooseNation__list">
                        {nations.map(el => {
                            return (
                                <div
                                    className={`ChooseNation__item ${
                                        selectedId && selectedId !== el.id ? "is-unselected" : ""
                                    }`}
                                    onDoubleClick={() => alert("show popup")}
                                    onClick={() => handleSelect(el.id)}
                                    key={el.id}>
                                    <div className="ChooseNation__name">{el.name}</div>

                                    <div className="ChooseNation__image">
                                        <img src={el.image} alt="" />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div className="ChooseNation__submit">
                        <Button action={handleSubmit} disabled={!selectedId}>
                            Submit
                        </Button>
                    </div>
                </>
            )}
        </div>
    );
};

const mapStateToProps = state => {
    return {
        data: state.app.data.nations,
    };
};

export default connect(mapStateToProps, null)(ChooseNation);
