import axios from 'axios';
import { deleteAuth, get, getAuth, postAuth, putAuth } from "../utils/request";

const AUTH_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1laWRlbnRpZmllciI6IjEiLCJlbWFpbCI6ImFkbWluQGhvc3RuYW1lLmNvbSIsImZ1bGxOYW1lIjoiU3VwZXIgVXNlciIsIm5hbWUiOiJTdXBlciIsInN1cm5hbWUiOiJVc2VyIiwiaXBBZGRyZXNzIjoiMC4wLjAuMSIsImF2YXRhclVybCI6IiIsIm1vYmlsZXBob25lIjoiIiwiZXhwIjoxNzgxMjcwNDgzLCJpc3MiOiJodHRwczovL0JFLlNFUDQ5MC5uZXQiLCJhdWQiOiJCRS5TRVA0OTAifQ.kQIX9uvjN9UOPiBitp9JsO2DlPlFyIU4VTP1ZyM4k3Y";

const api = axios.create({
  baseURL: 'https://localhost:8175/api/v1',
  headers: {
    'Authorization': `Bearer ${AUTH_TOKEN}`,
    'Content-Type': 'application/json'
  }
});

// Sample doctors data
const sampleDoctors = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    email: "sarah.johnson@hospital.com",
    phone: "+1-555-0123",
    specialization: "Cardiology",
    licenseNumber: "MD-2024-001",
    experience: 15,
    qualification: "MD, FACC",
    status: "active",
    departmentId: 1,
    departmentName: "Cardiology",
    rating: 4.9,
    totalPatients: 1250,
    joinDate: "2018-03-15",
    consultationFee: 200,
    avatar: "",
    bio: "Experienced cardiologist specializing in interventional procedures and heart disease prevention.",
    workingHours: "9:00 AM - 5:00 PM",
    availability: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    createdAt: "2024-01-15T08:00:00Z",
    updatedAt: "2024-06-10T14:30:00Z"
  },
  {
    id: 2,
    name: "Dr. Michael Chen",
    email: "michael.chen@hospital.com",
    phone: "+1-555-0456",
    specialization: "Neurology",
    licenseNumber: "MD-2024-002",
    experience: 12,
    qualification: "MD, PhD in Neuroscience",
    status: "active",
    departmentId: 2,
    departmentName: "Neurology",
    rating: 4.8,
    totalPatients: 980,
    joinDate: "2020-08-22",
    consultationFee: 250,
    avatar: "",
    bio: "Neurologist with expertise in stroke treatment and neurodegenerative diseases.",
    workingHours: "8:00 AM - 4:00 PM",
    availability: ["Monday", "Tuesday", "Thursday", "Friday"],
    createdAt: "2024-02-01T10:00:00Z",
    updatedAt: "2024-06-08T16:45:00Z"
  },
  {
    id: 3,
    name: "Dr. Emily Rodriguez",
    email: "emily.rodriguez@hospital.com",
    phone: "+1-555-0789",
    specialization: "Emergency Medicine",
    licenseNumber: "MD-2024-003",
    experience: 8,
    qualification: "MD, Emergency Medicine Residency",
    status: "active",
    departmentId: 1,
    departmentName: "Emergency",
    rating: 4.7,
    totalPatients: 2100,
    joinDate: "2021-11-05",
    consultationFee: 180,
    avatar: "",
    bio: "Emergency medicine physician with extensive trauma and critical care experience.",
    workingHours: "24/7 Shifts",
    availability: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    createdAt: "2024-03-10T09:15:00Z",
    updatedAt: "2024-05-20T11:20:00Z"
  }
];

// Get doctors by department
export const getDoctorsByDepartment = async (departmentId) => {
  try {
    if (process.env.NODE_ENV === 'development') {
      await new Promise(resolve => setTimeout(resolve, 500));
      return sampleDoctors.filter(doctor => doctor.departmentId === parseInt(departmentId));
    }
    
    const response = await api.get(`/departments/${departmentId}/doctors`);
    return response.data;
  } catch (error) {
    console.error('Error fetching doctors:', error);
    throw error;
  }
};

// Get all doctors
export const getAllDoctors = async (params = {}) => {
  try {
    if (process.env.NODE_ENV === 'development') {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      let filteredDoctors = [...sampleDoctors];
      
      if (params.search) {
        const searchLower = params.search.toLowerCase();
        filteredDoctors = filteredDoctors.filter(doctor => 
          doctor.name.toLowerCase().includes(searchLower) ||
          doctor.specialization.toLowerCase().includes(searchLower) ||
          doctor.email.toLowerCase().includes(searchLower)
        );
      }
      
      if (params.status && params.status !== 'all') {
        filteredDoctors = filteredDoctors.filter(doctor => doctor.status === params.status);
      }
      
      if (params.departmentId) {
        filteredDoctors = filteredDoctors.filter(doctor => doctor.departmentId === parseInt(params.departmentId));
      }
      
      return {
        items: filteredDoctors,
        total: filteredDoctors.length
      };
    }
    
    const response = await api.get('/doctors', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching doctors:', error);
    throw error;
  }
};

// Create doctor
export const createDoctor = async (doctorData) => {
  try {
    if (process.env.NODE_ENV === 'development') {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return {
        ...doctorData,
        id: sampleDoctors.length + 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    }
    
    const response = await api.post('/doctors/create', doctorData);
    return response.data;
  } catch (error) {
    console.error('Error creating doctor:', error);
    throw error;
  }
};

// Update doctor
export const updateDoctor = async (id, doctorData) => {
  try {
    if (process.env.NODE_ENV === 'development') {
      await new Promise(resolve => setTimeout(resolve, 800));
      return {
        ...doctorData,
        id,
        updatedAt: new Date().toISOString()
      };
    }
    
    const response = await api.put(`/doctors/${id}`, doctorData);
    return response.data;
  } catch (error) {
    console.error('Error updating doctor:', error);
    throw error;
  }
};

// Delete doctor
export const deleteDoctor = async (id) => {
  try {
    if (process.env.NODE_ENV === 'development') {
      await new Promise(resolve => setTimeout(resolve, 800));
      return true;
    }
    
    const response = await api.delete(`/doctors/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting doctor:', error);
    throw error;
  }
};

// Assign doctor to department
export const assignDoctorToDepartment = async (doctorId, departmentId) => {
  try {
    if (process.env.NODE_ENV === 'development') {
      await new Promise(resolve => setTimeout(resolve, 600));
      return true;
    }
    
    const response = await api.put(`/doctors/${doctorId}/assign-department`, { departmentId });
    return response.data;
  } catch (error) {
    console.error('Error assigning doctor to department:', error);
    throw error;
  }
};

export const getDoctorByHospitalId = async (id) => {
  try {
    const result = await get(`/doctors/by-hospital/${id}`);
    if (!result || !result.result) {
      throw new Error('User data is missing in the response.');
    }
    return result.result;
  } catch (error) {
    console.error(`Error fetching user with ID ${id}:`, error.message);
    throw error;
  }
};