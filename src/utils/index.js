import axios from 'axios';


export const ROOT_URL = '/app.php/messenger';

export function getRequest() {
    const request = axios.create({
        baseURL: ROOT_URL,
        timeout: 0,
        withCredentials: true
    });

    return request;
}
