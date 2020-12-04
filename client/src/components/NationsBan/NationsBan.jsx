import React from "react";
import { connect } from "react-redux";
import { setField } from "../../actions/app.actions";
import socket from "../../core/socket";
import { dataSelector, userSelector } from "../../selectors/app.selectors";
import "./NationsBan.styles.scss";

const MAX_BAN = 3;

const NationsBan = ({ data, banNationRequest, user, localBannedIds, setLocalBannedIds }) => {
    const handleBan = (id, status) => {
        const onRemove = !status;
        const hasLimit = localBannedIds.length >= MAX_BAN;

        if (onRemove) {
            if (!localBannedIds.includes(id)) return;

            const idx = localBannedIds.indexOf(id);

            if (idx > -1) {
                let copied = [...localBannedIds];
                copied.splice(idx, 1);
                setLocalBannedIds(copied);
            }

            socket.emit("banNationsClient", { id, status, name: user.name });
        }

        if (!onRemove && !hasLimit) {
            setLocalBannedIds([...localBannedIds, id]);
            socket.emit("banNationsClient", { id, status, name: user.name });
        }
    };

    return (
        <div className="NationsBan">
            <div className="NationsBan__list">
                {data &&
                    data.nations.map(item => {
                        return (
                            <div
                                onClick={() => handleBan(item.id, !item.banned)}
                                className={`NationsBan__item ${item.banned ? "is-disabled" : ""} ${
                                    localBannedIds.length >= MAX_BAN && !item.banned ? "is-limited" : ""
                                }`}
                                key={item.id}>
                                {item.banned && <div className="NationsBan__by">{item.bannedBy}</div>}
                                <div className="NationsBan__name">{item.name}</div>
                                <div className="NationsBan__image">
                                    <img src={item.image} alt="" />
                                </div>
                            </div>
                        );
                    })}
            </div>
        </div>
    );
};

const mapStateToProps = state => {
    return {
        data: dataSelector(state),
        user: userSelector(state),
        localBannedIds: state.app.localBannedIds,
    };
};

const mapDispatchtoProps = dispatch => {
    return {
        setLocalBannedIds: value => dispatch(setField("localBannedIds", value)),
    };
};

export default connect(mapStateToProps, mapDispatchtoProps)(NationsBan);
