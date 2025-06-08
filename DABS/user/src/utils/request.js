import axios from 'axios';
import { API_DOMAIN } from '../constant/api/api';


export const get = async (path) => {
    const response = await axios.get(API_DOMAIN + path);
    const result = response.data;
    return result;
}

export const post = async (path, options) => {
    try {
        const response = await axios.post(
            API_DOMAIN + path,
            options,
            {
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );
        return response.data;
    } catch (error) {
        if (error.response) {
            console.error("Error response from server:", error.response.data);
        } else {
            console.error("Error in POST request:", error.message);
        }
        throw error;
    }
};

export const register = async (options) => {
    const result = await post('users', options);
    return result;
}

export const checkExist = async (key, value) => {
    const result = await get(`users?${key}=${value}`);
    return result;
}