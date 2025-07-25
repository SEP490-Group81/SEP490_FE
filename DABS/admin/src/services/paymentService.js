import { getAuth } from "../utils/request";

export const getPayments = async (hospitalId, userId) => {
  try {
    let url = `/payment`;
    const queryParams = [];

    if (hospitalId !== undefined && hospitalId !== null) {
      queryParams.push(`hospitalId=${encodeURIComponent(hospitalId)}`);
    }
    if (userId !== undefined && userId !== null) {
      queryParams.push(`userId=${encodeURIComponent(userId)}`);
    }

    if (queryParams.length > 0) {
      url += `?${queryParams.join('&')}`;
    }

    const response = await getAuth(url);
    return response; 
  } catch (error) {
    console.error("Lỗi khi lấy thanh toán:", error);
    throw error;
  }
};