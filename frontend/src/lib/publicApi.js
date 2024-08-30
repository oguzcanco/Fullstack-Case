import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8001/api',
    headers: {
        'Accept': 'application/json'
    }
});

const publicApi = (method, url, data = null) => {
    return api({
        method,
        url,
        data,
        headers: { Authorization: null }
    });
};

export { publicApi };