import * as cloneDeep from 'lodash/cloneDeep';
import { createSelector } from "reselect";

export const appSelector = state => cloneDeep(state.app);

export const loginedSelector = createSelector(
    appSelector,
    (app) => app.logined
);

export const userSelector = createSelector(
    appSelector,
    (app) => app.user
);