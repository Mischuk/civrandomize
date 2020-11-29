import serializeParams from './serializeParams';

const API_PATH = process.env.REACT_APP_API_PATH;

class ApiConfig {
    constructor(methods = []) {
        methods.forEach(({ name, url }) => {
            this[name] = `${API_PATH}/${url}`;
        });
    }

    get(name, params = {}) {
        return `${this[name]}?${serializeParams(params)}`
    }

    getWithIds(name, ids, params = {}) {
        return `${this[name]}/${ids.join('/')}?${serializeParams(params)}`
    }

    getWithId(name, id, params = {}) {
        return this.getWithIds(name, [id], params);
    }

}

export default new ApiConfig([
    { name: 'data', url: 'data' },
]);
