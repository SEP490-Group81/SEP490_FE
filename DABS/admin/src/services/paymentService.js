import { getAuth, postAuth, putAuth } from '../utils/request';

// ✅ Create payment link
export const createPaymentLink = async (paymentData) => {
  try {
    console.log('🔄 Creating payment link:', paymentData);
    const result = await postAuth('/payment/payos/create-payment-link', paymentData);
    console.log('✅ Payment link created:', result);
    return result;
  } catch (error) {
    console.error('❌ Error creating payment link:', error.message);
    throw error;
  }
};

// ✅ Handle transfer (webhook handler)
export const handleTransfer = async (transferData) => {
  try {
    console.log('🔄 Handling transfer:', transferData);
    const result = await postAuth('/payment/payos/transfer_handler', transferData);
    console.log('✅ Transfer handled:', result);
    return result;
  } catch (error) {
    console.error('❌ Error handling transfer:', error.message);
    throw error;
  }
};

// ✅ Confirm webhook
export const confirmWebhook = async (webhookData) => {
  try {
    console.log('🔄 Confirming webhook:', webhookData);
    const result = await postAuth('/payment/payos/confirm-webhook', webhookData);
    console.log('✅ Webhook confirmed:', result);
    return result;
  } catch (error) {
    console.error('❌ Error confirming webhook:', error.message);
    throw error;
  }
};

// ✅ Get payment by order ID
export const getPaymentByOrderId = async (orderId) => {
  try {
    console.log('🔄 Fetching payment for order:', orderId);
    const result = await getAuth(`/payment/payos/${orderId}`);
    console.log('✅ Payment data fetched:', result);
    return result;
  } catch (error) {
    console.error('❌ Error fetching payment:', error.message);
    throw error;
  }
};

// ✅ Cancel payment
export const cancelPayment = async (orderId, cancelData) => {
  try {
    console.log('🔄 Cancelling payment for order:', orderId);
    const result = await putAuth(`/payment/payos/${orderId}/cancel`, cancelData);
    console.log('✅ Payment cancelled:', result);
    return result;
  } catch (error) {
    console.error('❌ Error cancelling payment:', error.message);
    throw error;
  }
};