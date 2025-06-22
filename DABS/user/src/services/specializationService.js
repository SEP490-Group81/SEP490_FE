import { get } from "../utils/request";

export const getSpecializationList = async () => {
    try {
        const result = await get('/specialization');
       
        if (!result || !result.result) {
            throw new Error('Specialization data is missing in the response.');
        }

        return result.result;
    } catch (error) {
        console.error(`Error fetching specialization`, error.message);
        throw error;
    }
};