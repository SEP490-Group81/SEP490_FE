import { post } from "../utils/request";

export const fetchToken = async (email, password) => {
    const path = "/api/v1/token";
    const options = {
        email,
        password,
    };

    try {
        const data = await post(path, options);
        return data; 
    } catch (error) {
        console.error("Failed to fetch token:", error);
        throw error;
    }
};