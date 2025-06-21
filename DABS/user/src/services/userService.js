import { getAuth, putAuth} from "../utils/request";

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

export const updateUser = async (userData) => {
  try {
    const result = await putAuth(`/user/update`, userData);
    console.log(`User updated successfully:`, result);
    return result;
  } catch (error) {
    console.error(`Error updating user with ID ${userData.id}:`, error.message);
    throw error;
  }
};