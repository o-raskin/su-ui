import Axios from "axios";
import {store} from '../../store';

export const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8099'
export const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:4040'

export const AxiosClient = Axios.create({
    baseURL: BACKEND_URL,
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true
});

/**
 *  If we're know token => user authenticated => use this token for requests
 */
AxiosClient.interceptors.request.use(
    config => {
        config.headers.authorization = 'Bearer ' + localStorage.getItem("ACCESS_TOKEN");
        return config;
    },
    error => Promise.reject(error)
);