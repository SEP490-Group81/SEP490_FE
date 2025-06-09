import { get } from "../utils/request";

export const getUserById = async (id) => {
    try {
        const result = await get(`/user/${id}`);
        return result;
    } catch (error) {
        console.error('Error fetching user:', error);
        throw error;
    }
};