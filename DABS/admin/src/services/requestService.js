import { getAuth } from "../utils/request";

export const getRequestsByHospital = async (hospitalId, userId) => {
  if (!hospitalId) {
    throw new Error("Hospital ID is required to fetch requests.");
  }

  try {
    let url = `/requests/hospital/${hospitalId}`;

    if (userId !== undefined && userId !== null) {
      url += `?userId=${encodeURIComponent(userId)}`;
    }

    const response = await getAuth(url);

    return response; 
  } catch (error) {
    console.error("Lỗi khi lấy yêu cầu theo hospital:", error);
    throw error;
  }
};