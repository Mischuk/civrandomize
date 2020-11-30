const defaultHeaders = [
    { key: "Accept", value: "application/json", },
    { key: "Content-type", value: "application/json; charset=utf-8", },
];

class Http {
    fetch(method, url, sendData, headers = defaultHeaders) {
        const xhr = new window.XMLHttpRequest();
        xhr.open(method, url);
        headers.forEach(({ key, value }) => xhr.setRequestHeader(key, value));
        xhr.withCredentials = false;
        const promise = new Promise((resolve, reject) => {
            xhr.onload = () => {
                if (xhr.status >= 200 && xhr.status < 300) {
                    try {
                        resolve(JSON.parse(xhr.response));
                    } catch (err) {
                        resolve(xhr.response);
                    }
                } else {
                    reject(xhr);
                }
            };

            xhr.onerror = () => reject(xhr);

            if (sendData) {
                xhr.send(sendData);
            } else {
                xhr.send();
            }
        });
        promise.abort = () => {
            xhr.abort();
        };
        return promise;
    }

    get(url) {
        return this.fetch("GET", url);
    }

    post(url, body) {
        return this.fetch("POST", url, JSON.stringify(body));
    }

    put(url, body) {
        return this.fetch("PUT", url, JSON.stringify(body));
    }

    delete(url, body) {
        return this.fetch("DELETE", url, JSON.stringify(body));
    }
}

export default new Http();
