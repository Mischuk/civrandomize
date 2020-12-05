import React, { useEffect, useState } from "react";
import { AiOutlineLike } from "react-icons/ai";
import { connect } from "react-redux";
import useTraceUpdate from "use-trace-update";
import socket from "../../core/socket";
import Button from "../Button";
import Modal from "../Modal/Modal";
import RandomSpinner from "../RandomSpinner/RandomSpinner";
import UsersActions from "../UsersActions/UsersActions";
import "./ChooseNation.scss";

const ChooseNation = props => {
    useTraceUpdate(props);
    const { gameIds, currentUser, data, selected, showNationsSpinner } = props;
    const getCurrentUserIds = gameIds.find(({ username }) => username === currentUser.name).ids;
    const nations = data.filter(f => getCurrentUserIds.includes(f.id));
    const [selectedId, setSelectedId] = useState(null);
    const [submited, setSubmited] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [modalChild, setModalChild] = useState(null);

    useEffect(() => {
        setSubmited(false);
        setSelectedId(false);
        setShowModal(false);
    }, [showNationsSpinner]);

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
                    <img src={currentNation.image} alt="" onDoubleClick={() => handleOpenModal(currentNation.id)} />
                </div>
            </div>
        );
    };

    const handleReRandom = () => {
        handleSelect(null);
        setShowModal(false);
    };

    const handleOpenModal = id => {
        setShowModal(true);
        setModalChild(data.find(item => item.id === id));
    };

    const renderNation = player => {
        const { unique, info } = player;
        return (
            <div className="nation">
                <div className="nation__unique">
                    {unique.map((el, index) => (
                        <div key={index} className="nation__unique-item">
                            {el}
                        </div>
                    ))}
                </div>

                {player.buildings && (
                    <div className="nation__unique nation__unique--nested">
                        {player.buildings.map((el, index) => (
                            <div key={index} className="nation__unique-item">
                                <div className="nation__title nation__title--small">
                                    <img className="nation__title-image" src={el.image} alt="" />
                                    {el.title}
                                    <div className="nation__sub-title">{el.desc}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {player.units && (
                    <div className="nation__unique nation__unique--nested">
                        {player.units.map((el, index) => (
                            <div key={index} className="nation__unique-item">
                                <div className="nation__title nation__title--small">
                                    <img className="nation__title-image" src={el.image} alt="" />
                                    {el.title}
                                    <div className="nation__sub-title">{el.desc}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div className="nation__unique">

                    <div className="nation__unique-item">
                        {info.type.map((el, index) => (
                            <span key={index}>{index > 0 && " / "}{el}</span>
                        ))}
                    </div>
                    <div className="nation__unique-item">{info.boost}</div>
                </div>
            </div>
        );
    };

    return (
        <div className="ChooseNation">
            {showNationsSpinner && <RandomSpinner />}
            {submited && !showNationsSpinner && (
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
            {!submited && !showNationsSpinner && (
                <>
                    <div className="ChooseNation__list">
                        {nations.map(el => {
                            return (
                                <div
                                    className={`ChooseNation__item ${
                                        selectedId && selectedId !== el.id ? "is-unselected" : ""
                                    }`}
                                    onDoubleClick={() => handleOpenModal(el.id)}
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
                    <div className="ChooseNation__actions">
                        <div className="ChooseNation__next" onClick={() => handleReRandom()}>
                            <UsersActions tryAgain />
                        </div>
                        <div className="ChooseNation__submit">
                            <Button action={handleSubmit} disabled={!selectedId}>
                                <AiOutlineLike style={{ fontSize: "36px" }} />
                            </Button>
                        </div>
                    </div>
                </>
            )}
            <Modal
                onClose={() => {
                    setShowModal(false);
                    setModalChild(null);
                }}
                title={modalChild && modalChild.name}
                isOpen={showModal}>
                {modalChild && renderNation(modalChild)}
            </Modal>
        </div>
    );
};

const mapStateToProps = state => {
    return {
        data: state.app.data.nations,
        selected: state.app.selectedNationsGlobal || [],
        showNationsSpinner: state.app.showNationsSpinner,
    };
};

export default connect(mapStateToProps, null)(ChooseNation);
