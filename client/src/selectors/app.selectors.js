import * as cloneDeep from 'lodash/cloneDeep';
import { createSelector } from "reselect";

export const appSelector = state => cloneDeep(state.app);

export const userAuthSelector = createSelector(
    appSelector,
    (app) => app.isAuth
);