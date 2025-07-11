import { deleteAuth, get, getAuth, postAuth, putAuth } from "../utils/request";

export const getSteps = async () => {
    try {
        const result = await getAuth('/step');

        if (!result || !result.result) {
            throw new Error('Step data is missing in the response.');
        }

        return result.result;
    } catch (error) {
        console.error(`Error fetching Step`, error.message);
        throw error;
    }
};

export const getServices = async () => {
    try {
        const result = await get('/service');
        console.log("API raw result:", result);

        return result;
    } catch (error) {
        console.error(`Error fetching Service`, error.message);
        throw error;
    }
};

export const updateService = async (specializationData) => {
  try {
    const result = await putAuth(`/service`, specializationData);
    console.log(`User updated successfully:`, result);
    return result;
  } catch (error) {
    console.error(`Error updating user with ID ${specializationData.id}:`, error.message);
    throw error;
  }
};

export const createService= async (service) => {
  try {
    const result = await postAuth(`/service`, service);
    console.log(`service created successfully:`, result);
    return result;
  } catch (error) {
    console.error(`Error creating service with ID ${service.id}:`, error.message);
    throw error;
  }
};

export const deleteSpecialization = async (specializationId) => {
  try {
    const result = await deleteAuth(`/specialization`, specializationId);
    console.log(`User created successfully:`, result);
    return result;
  } catch (error) {
    console.error(`Error delete user with ID ${specializationId}:`, error.message);
    throw error;
  }
};