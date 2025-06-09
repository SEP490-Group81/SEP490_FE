import { post } from "../utils/request";

export const fetchToken = async (email, password) => {
    const path = "/tokens";
    const options = {
        email,
        password,
    };

    try {
        const data = await post(path, options);
        return data; 
    } catch (error) {
        if (error.response) {
            console.error("Backend responded with an error:", error.response.data);
        } else {
            console.error("Failed to fetch token:", error.message);
        }
        throw error;
    }
};

export const register = async (options) => {
    const result = await post('users', options);
    return result;
}