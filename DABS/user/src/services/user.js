import { getAuth} from "../utils/request";

export const getUserById = async (id) => {
    try {
        const result = await getAuth(`/user/${id}`);
        console.log(`User with ID ${id} fetched successfully:`, result.result);
        if (!result || !result.result) {
            throw new Error('User data is missing in the response.');
        }

        return result.result;
    } catch (error) {
        console.error(`Error fetching user with ID ${id}:`, error.message);
        throw error;
    }
};