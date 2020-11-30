import apiConfig from './apiConfig';
import http from './http';

export async function getNations() {
    return await http.get(apiConfig.get('nations'));
}
