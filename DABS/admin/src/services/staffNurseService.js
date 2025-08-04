import { getAuth, postAuth } from "../utils/request";

export const getStaffNurseList = async (hospitalId) => {
  try {
    const result = await getAuth(`/staffnurse/by-hospital/${hospitalId}`);
    console.log(`Fetched rooms for hospital ${hospitalId}:`, result);
    return result.result;
  } catch (error) {
    console.error(`Error fetching rooms for hospital ID ${hospitalId}:`, error.message);
    throw error;
  }
};

export const getStaffSchedules = async (hospitalId, userId, dateFrom, dateTo) => {
  try {
    const payload = {
      hospitalId,
      userId,
      dateFrom,
      dateTo,
    };

    const result = await postAuth('/staffschedules', payload);

    console.log('Fetched staff schedules:', result);

    return result.result;
  } catch (error) {
    console.error('Error fetching staff schedules:', error.message);
    throw error;
  }
};

export const getStaffNurseByUserId = async (id) => {
  try {
    const result = await getAuth(`/staffnurse/by_users/${id}`);
    if (!result || !result.result) {
      throw new Error('Staff nurse is missing in the response.');
    }
    return result.result;
  } catch (error) {
    console.error(`Error fetching staff nurse with ID ${id}:`, error.message);
    throw error;
  }
};