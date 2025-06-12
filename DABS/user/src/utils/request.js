import axios from 'axios';
import { API_DOMAIN, PATH } from '../constant/api/api';
import Cookies from 'js-cookie';


export const get = async (path, headers = {}) => {
    try {
        const response = await axios.get(`${API_DOMAIN}${PATH}${path}`, {
            headers,
        });
        console.log(`GET request to ${path} successful:`, response.data);
        return response.data; 
    } catch (error) {
        console.error(`Error in GET request to ${path}:`, error.message);
        throw error;
    }
};
export const getAuth = () => {
    const token = Cookies.get('accessToken');
    if (!token) {
        console.warn('Access token is missing.');
        return {}; 
    }
    return {
        Authorization: `Bearer ${token}`,
    };
};
export const post = async (path, options) => {
    try {
        const response = await axios.post(
            API_DOMAIN + PATH + path,
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



// export const checkExist = async (key, value) => {
//     const result = await get(`users?${key}=${value}`);
//     return result;
// }