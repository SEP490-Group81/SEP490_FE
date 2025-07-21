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