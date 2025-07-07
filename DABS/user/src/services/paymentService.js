import axios from 'axios';

const AUTH_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1laWRlbnRpZmllciI6IjEiLCJlbWFpbCI6ImFkbWluQGhvc3RuYW1lLmNvbSIsImZ1bGxOYW1lIjoiU3VwZXIgVXNlciIsIm5hbWUiOiJTdXBlciIsInN1cm5hbWUiOiJVc2VyIiwiaXBBZGRyZXNzIjoiMC4wLjAuMSIsImF2YXRhclVybCI6IiIsIm1vYmlsZXBob25lIjoiIiwiZXhwIjoxNzgxMjcwNDgzLCJpc3MiOiJodHRwczovL0JFLlNFUDQ5MC5uZXQiLCJhdWQiOiJCRS5TRVA0OTAifQ.kQIX9uvjN9UOPiBitp9JsO2DlPlFyIU4VTP1ZyM4k3Y";

const api = axios.create({
  baseURL: 'https://localhost:8175/api/v1',
  headers: {
    'Authorization': `Bearer ${AUTH_TOKEN}`,
    'Content-Type': 'application/json'
  }
});

// Sample payment history
const samplePaymentHistory = [
  {
    id: 1,
    appointmentId: 1,
    amount: 150.00,
    method: "Credit Card",
    status: "completed",
    transactionId: "TXN-001-2024",
    date: "2024-07-15T10:30:00Z",
    hospitalName: "City General Hospital",
    service: "Consultation"
  },
  {
    id: 2,
    appointmentId: 3,
    amount: 300.00,
    method: "PayPal",
    status: "completed",
    transactionId: "TXN-002-2024",
    date: "2024-06-25T09:45:00Z",
    hospitalName: "City General Hospital",
    service: "Emergency Treatment"
  }
];

// Process payment
export const processPayment = async (paymentData) => {
  try {
    if (process.env.NODE_ENV === 'development') {
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate payment processing
      
      // Simulate success/failure (90% success rate)
      const isSuccess = Math.random() > 0.1;
      
      if (isSuccess) {
        return {
          success: true,
          transactionId: `TXN-${Date.now()}`,
          amount: paymentData.amount,
          method: paymentData.method,
          date: new Date().toISOString()
        };
      } else {
        throw new Error('Payment failed. Please try again.');
      }
    }
    
    const response = await api.post('/payments/process', paymentData);
    return response.data;
  } catch (error) {
    console.error('Error processing payment:', error);
    throw error;
  }
};

// Get payment history
export const getPaymentHistory = async (patientId) => {
  try {
    if (process.env.NODE_ENV === 'development') {
      await new Promise(resolve => setTimeout(resolve, 500));
      return samplePaymentHistory;
    }
    
    const response = await api.get(`/patients/${patientId}/payments`);
    return response.data;
  } catch (error) {
    console.error('Error fetching payment history:', error);
    throw error;
  }
};

// Get payment methods
export const getPaymentMethods = async (patientId) => {
  try {
    if (process.env.NODE_ENV === 'development') {
      await new Promise(resolve => setTimeout(resolve, 300));
      return [
        {
          id: 1,
          type: "Credit Card",
          last4: "4567",
          brand: "Visa",
          isDefault: true
        },
        {
          id: 2,
          type: "Credit Card",
          last4: "8901",
          brand: "Mastercard",
          isDefault: false
        }
      ];
    }
    
    const response = await api.get(`/patients/${patientId}/payment-methods`);
    return response.data;
  } catch (error) {
    console.error('Error fetching payment methods:', error);
    throw error;
  }
};

// Add payment method
export const addPaymentMethod = async (patientId, methodData) => {
  try {
    if (process.env.NODE_ENV === 'development') {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return {
        id: Date.now(),
        ...methodData,
        isDefault: false
      };
    }
    
    const response = await api.post(`/patients/${patientId}/payment-methods`, methodData);
    return response.data;
  } catch (error) {
    console.error('Error adding payment method:', error);
    throw error;
  }
};