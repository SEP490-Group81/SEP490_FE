import axios from 'axios';
const API_DOMAIN = "http://localhost:3002/";

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
        console.error("Error in POST request:", error);
        throw error; 
    }
};

export const register = async (options) => {
    const result = await post('users', options);
    return result;
}

export const checkExist = async(key,value) => {
    const result = await get(`users?${key}=${value}`);
    return result;
}