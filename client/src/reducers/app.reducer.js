import { APP } from "../core/actionNames";

const { SET_FIELD, SET_DATA, RESET } = APP;

const initialState = {
    isAppLoading: true,
    isAuth: false
};

export default function app(state = initialState, action) {
    switch (action.type) {
        case SET_FIELD: {
            return {
                ...state,
                [action.key]: action.value,
            };
        }
        case SET_DATA: {
            return {
                ...state,
                ...action.data,
            };
        }
        case RESET: {
            return initialState;
        }
        default: {
            return { ...state };
        }
    }
}
