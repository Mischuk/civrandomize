import * as cloneDeep from 'lodash/cloneDeep';
import { createSelector } from "reselect";

export const appSelector = state => cloneDeep(state.app);
export const bannedIdsSelector = state => cloneDeep(state.app.bannedIds);

export const loginedSelector = createSelector(
    appSelector,
    (app) => app.logined
);

export const userSelector = state => state.app.user;

export const dataSelector = createSelector(
    appSelector,
    bannedIdsSelector,
    (app, bannedIds) => {
        console.log(`bannedIds: `, bannedIds);
        const updatedNations = app.data.nations.map(el => {
            const finded = bannedIds.find(item => item.id === el.id);
            if ( finded ) {
                return {...el, banned: finded.status, bannedBy: finded.name}
            }
            return el;
        });
        return { nations: updatedNations }
    }
);