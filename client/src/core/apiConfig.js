import serializeParams from './serializeParams';



class ApiConfig {
    constructor(methods = []) {
        methods.forEach(({ name, url }) => {
            this[name] = `${url}`;
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
    { name: 'nations', url: '/api/nations' },
]);
