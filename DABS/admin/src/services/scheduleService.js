import { deleteAuth, get, getAuth, postAuth, putAuth } from "../utils/request";

export const getScheduleByDoctorId = async (doctorId, from, to) => {
  try {
    const result = await getAuth(`/doctors/${doctorId}/schedule?from=${from}&to=${to}`);
    console.log(`Schedule for doctor ${doctorId} from ${from} to ${to}:`, result);

    if (!result) {
      throw new Error("Invalid response from server. Expected an array.");
    }

    return result.result;
  } catch (error) {
    console.error(`Error fetching schedule for doctor ${doctorId}:`, error.message);
    throw error;
  }
};

export const createSchedule = async (scheduleData) => {
  try {
    const result = await postAuth("/schedules", scheduleData);
    console.log("Schedule created successfully:", result);
    return result;
  } catch (error) {
    console.error("Error creating schedule:", error.message);
    throw error;
  }
};

export const updateSchedule = async (scheduleData,scheduleId) => {
  try {
    const result = await putAuth(`/schedules/${scheduleId}`, scheduleData);
    console.log("Schedule created successfully:", result);
    return result;
  } catch (error) {
    console.error("Error creating schedule:", error.message);
    throw error;
  }
};