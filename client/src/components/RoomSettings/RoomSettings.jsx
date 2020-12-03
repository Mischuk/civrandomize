import React from "react";
import { connect } from "react-redux";
import { dataSelector } from "../../selectors/app.selectors";
import "./RoomSettings.styles.scss";

function RoomSettings({data}) {
    return <div className="RoomSettings">
        <div className="RoomSettings__row">Banned: </div>
    </div>;
}

const mapStateToProps = state => {
    return {
        data: dataSelector(state),
    };
};


export default connect(mapStateToProps, null)(RoomSettings);