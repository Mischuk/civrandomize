import apiConfig from './apiConfig';
import http from './http';

export async function getData() {
    return await http.get(apiConfig.get('data'));
}
