import { APP } from "../core/actionNames";

const { SET_FIELD, SET_DATA, RESET } = APP;

export function setField(key, value) {
    return {
        type: SET_FIELD,
        key,
        value,
    };
}

export function setData(data) {
    return {
        type: SET_DATA,
        data,
    };
}

export function reset() {
    return {
        type: RESET,
    };
}

export function loginUser({token, userId, userName}) {
    return dispatch => {
        localStorage.setItem("token", token);
        localStorage.setItem("userId", userId);
        localStorage.setItem("userName", userName);
        dispatch(setField("isAuth", true));
        dispatch(setField("userId", userId));
        dispatch(setField("userName", userName));
    }
}

export function logoutUser() {
    return dispatch => {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("userName");
        dispatch(setField("isAuth", false));
        dispatch(setField("userId", null));
        dispatch(setField("userName", null));
    }
}

export function getData() {
    return dispatch => {
        // dispatch(getCountries());
        // dispatch(getFilters());
        // dispatch(getKeywordSettingsData())
        // dispatch(getKeywordNames());
        // dispatch(getAccess());
        setTimeout(() => {
            dispatch(setField("isAppLoading", false));
        }, 500);
    };
}
