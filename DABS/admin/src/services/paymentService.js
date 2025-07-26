import { getAuth, putAuth } from "../utils/request";

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

export const cancelAppointment = async (appointmentId) => {
  if (!appointmentId) throw new Error('appointmentId là bắt buộc');
  try {
    const response = await putAuth(`/appointments/${appointmentId}/cancel`);
    return response;
  } catch (error) {
    console.error('Lỗi khi hủy lịch hẹn:', error);
    throw error;
  }
};

export const changeAppointmentStatus = async (appointmentId, status) => {
  if (!appointmentId) throw new Error('appointmentId là bắt buộc');
  if (typeof status !== 'string') throw new Error('status phải là string');
  try {
    console.log(`Đang đổi trạng thái lịch hẹn ${appointmentId} sang ${status}`);
    const response = await putAuth(`/appointments/${appointmentId}/change-status`, status);
    return response;
  } catch (error) {
    console.error('Lỗi khi đổi trạng thái lịch hẹn:', error);
    throw error;
  }
};