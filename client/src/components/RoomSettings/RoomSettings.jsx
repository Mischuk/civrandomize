import React, { useEffect, useState } from "react";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";
import { connect } from "react-redux";
import socket from "../../core/socket";
import { dataSelector } from "../../selectors/app.selectors";
import Button from "../Button";
import "./RoomSettings.styles.scss";

const Counter = ({ currentCounter, action }) => {
    const handleClick = (updValue) => {
        action(currentCounter + updValue)
    }
    return (
        <div className="Counter">
            <div className="Counter__dec" onClick={() => currentCounter >= 2 && handleClick(-1)}>
                <Button disabled={currentCounter === 1 }>
                    <FaArrowDown />
                </Button>
            </div>
            <div className="Counter__value">{currentCounter}</div>
            <div className="Counter__inc" onClick={() => currentCounter <= 3 && handleClick(1)}>
                <Button disabled={currentCounter === 4 }>
                    <FaArrowUp />
                </Button>
            </div>
        </div>
    );
};

const BannedNations = ({ data }) => {
    if (data.length === 0) return <div className="BannedNations__no-data">No bans...</div>;

    return data.map(item => {
        return (
            <div className="BannedNations__item" key={item.id}>
                <div className="BannedNations__name">{item.name}</div>
                <div className="BannedNations__image">
                    <img src={item.image} alt="" />
                </div>
            </div>
        );
    });
};

function RoomSettings({ data, currentCounter }) {
    const [bannedItems, setBannedItems] = useState([]);

    useEffect(() => {
        setBannedItems(data.nations.filter(item => item.banned));
    }, [data]);

    const handleUpdateCounter = value => {
        socket.emit("updateCounterClient", value);
    };

    return (
        <div className="RoomSettings">
            <div className="RoomSettings__column has-shadow">
                <div className="BannedNations">
                    <BannedNations data={bannedItems} />
                </div>
            </div>
            <div className="RoomSettings__column">
                <div className="RoomSettings__counter">
                    <div className="RoomSettings__counter-title">Nations to choise</div>
                    <Counter action={handleUpdateCounter} currentCounter={currentCounter} />
                </div>
            </div>
        </div>
    );
}

const mapStateToProps = state => {
    return {
        data: dataSelector(state),
        currentCounter: state.app.currentCounter,
    };
};

export default connect(mapStateToProps, null)(RoomSettings);
