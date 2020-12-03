import React, { useState } from "react";
import { connect } from "react-redux";
import socket from "../../core/socket";
import { dataSelector, userSelector } from "../../selectors/app.selectors";
import "./NationsBan.styles.scss";

const NationsBan = ({ data, banNationRequest, user }) => {
    console.log(`user: `, user);
    const MAX_BAN = 3;
    const [countBans, setCountBans] = useState(0);
    const [localIds, setLocalIds] = useState([]);


    const handleBan = (id, status) => {
        if ( !status ) {
            if ( !localIds.includes(id) ) return;
            setCountBans(prevState => {
                return prevState <= 1 ? 0 : prevState - 1
            });
            const idx = localIds.indexOf(id);
            if (idx > -1) {
                let copied = [...localIds];
                copied.splice(idx, 1);
                setLocalIds(copied);
            }
        } else {
            if ( countBans >= MAX_BAN ) return;

            setLocalIds(prevState => [...prevState, id]);
            setCountBans(prevState => {
                return prevState >= 2 ? 3 : prevState + 1
            });

        }

        socket.emit("banNationsClient", { id, status, name: user.name });
    };

    return (
        <div className="NationsBan">
            <div className="NationsBan__list">
                {data &&
                    data.nations.map(item => {
                        return (
                            <div
                                onClick={() => handleBan(item.id, !item.banned)}
                                className={`NationsBan__item ${item.banned ? "is-disabled" : ""} ${countBans >= MAX_BAN && !item.banned ? "is-limited" : ""}`}
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
        user: userSelector(state)
    };
};




export default connect(mapStateToProps, null)(NationsBan);
