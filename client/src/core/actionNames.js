export class ActionBlock {
    constructor(blockName, actions = []) {
        actions.map(action => this[action] = `${blockName}__${action}` )
    }
}

export const APP = new ActionBlock('APP', ['SET_ADD', 'SET_FIELD', 'SET_TOKEN', 'RESET_DATA']);