import { get, putAuth } from "../utils/request";

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

export const updateSpecialization = async (specializationData) => {
  try {
    const result = await putAuth(`/specialization/update`, specializationData);
    console.log(`User updated successfully:`, result);
    return result;
  } catch (error) {
    console.error(`Error updating user with ID ${specializationData.id}:`, error.message);
    throw error;
  }
};