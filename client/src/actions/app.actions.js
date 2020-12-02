import { APP } from "../core/actionNames";
import { getNations } from "../core/api";

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

export function loginUser({ token, userId, userName }) {
    return dispatch => {
        localStorage.setItem("token", token);
        localStorage.setItem("userId", userId);
        localStorage.setItem("userName", userName);
        dispatch(setField("user", { name: userName, id: userId }));
        dispatch(setField("logined", true));
    };
}

export function logoutUser() {
    return dispatch => {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("userName");
        dispatch(setField("logined", false));
        dispatch(setField("user", null));
    };
}

export function getData() {
    return async dispatch => {
        dispatch(setField("loading", true));
        const onSuccess = data => {
            dispatch(setField("data", data));
            setTimeout(() => {
                dispatch(setField("loading", false));
            }, 1000);
            return data;
        };

        const onError = error => {
            console.log(`error: `, error);
            dispatch(setField("error", error.message));
            dispatch(setField("loading", false));
            return error;
        };

        try {
            const data = await getNations();
            return onSuccess(data);
        } catch (error) {
            return onError(error);
        }
    };
}
