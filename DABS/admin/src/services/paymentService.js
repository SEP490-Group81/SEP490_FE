import { getAuth, putAuth, putAuthNum } from "../utils/request";

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

    const result = await getAuth(url);
    return result;
  } catch (error) {
    console.error("Lỗi khi lấy thanh toán:", error);
    throw error;
  }
};

export const cancelAppointment = async (appointmentId) => {
  if (!appointmentId) throw new Error('appointmentId là bắt buộc');
  try {
    const result = await putAuth(`/appointments/${appointmentId}/cancel`);
    return result;
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
    const result = await putAuth(`/appointments/${appointmentId}/change-status`, status);
    return result;
  } catch (error) {
    console.error('Lỗi khi đổi trạng thái lịch hẹn:', error);
    throw error;
  }
};


export const changePaymentStatus = async (paymentId, status) => {
  if (!paymentId) throw new Error('appointmentId là bắt buộc');

  try {
    console.log(`Đang đổi trạng thái lịch hẹn ${paymentId} sang ${status}`);

    const jsonStringBody = JSON.stringify(String(status));  

    const result = await putAuthNum(
      `/payment/${paymentId}/change-status`,
      jsonStringBody,
      { 'Content-Type': 'application/json' } 
    );

    return result;
  } catch (error) {
    console.error('Lỗi khi đổi trạng thái lịch hẹn:', error);
    throw error;
  }
};

export const getPaymentDetail = async (paymentId) => {

  try {
   
    const result = await getAuth( `/payment/${paymentId}`);

    return result.result; 
  } catch (error) {
    console.error("Lỗi khi lấy yêu cầu theo hospital:", error);
    throw error;
  }
};