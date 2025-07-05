import axios from 'axios';

// Token cho authorization (sử dụng token giống User Management)
const AUTH_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1laWRlbnRpZmllciI6IjEiLCJlbWFpbCI6ImFkbWluQGhvc3RuYW1lLmNvbSIsImZ1bGxOYW1lIjoiU3VwZXIgVXNlciIsIm5hbWUiOiJTdXBlciIsInN1cm5hbWUiOiJVc2VyIiwiaXBBZGRyZXNzIjoiMC4wLjAuMSIsImF2YXRhclVybCI6IiIsIm1vYmlsZXBob25lIjoiIiwiZXhwIjoxNzgxMjcwNDgzLCJpc3MiOiJodHRwczovL0JFLlNFUDQ5MC5uZXQiLCJhdWQiOiJCRS5TRVA0OTAifQ.kQIX9uvjN9UOPiBitp9JsO2DlPlFyIU4VTP1ZyM4k3Y";

// Cấu hình axios với baseURL và headers
const api = axios.create({
  baseURL: 'https://localhost:8175/api/v1',
  headers: {
    'Authorization': `Bearer ${AUTH_TOKEN}`,
    'Content-Type': 'application/json'
  }
});

// Sample data for development
const sampleDepartments = [
  {
    id: 1,
    name: "Emergency Department",
    code: "EM",
    description: "Emergency medical services and trauma care",
    status: "active",
    headOfDepartment: "Dr. John Smith",
    location: "Building A - Floor 1",
    phoneNumber: "+1-234-567-8901",
    email: "emergency@hospital.com",
    totalStaff: 25,
    totalBeds: 15,
    operatingHours: "24/7",
    createdAt: "2024-01-15T08:00:00Z",
    updatedAt: "2024-06-10T14:30:00Z"
  },
  {
    id: 2,
    name: "Cardiology Department",
    code: "CD",
    description: "Heart and cardiovascular disease treatment",
    status: "active",
    headOfDepartment: "Dr. Sarah Wilson",
    location: "Building B - Floor 3",
    phoneNumber: "+1-234-567-8902",
    email: "cardiology@hospital.com",
    totalStaff: 18,
    totalBeds: 20,
    operatingHours: "Mon-Fri: 8AM-6PM",
    createdAt: "2024-02-01T10:00:00Z",
    updatedAt: "2024-06-08T16:45:00Z"
  },
  {
    id: 3,
    name: "Pediatrics Department",
    code: "PD",
    description: "Medical care for infants, children, and adolescents",
    status: "inactive",
    headOfDepartment: "Dr. Michael Brown",
    location: "Building C - Floor 2",
    phoneNumber: "+1-234-567-8903",
    email: "pediatrics@hospital.com",
    totalStaff: 12,
    totalBeds: 30,
    operatingHours: "Mon-Sat: 7AM-8PM",
    createdAt: "2024-03-10T09:15:00Z",
    updatedAt: "2024-05-20T11:20:00Z"
  }
];

// Get all departments with pagination and filters
export const getAllDepartments = async (params = {}) => {
  try {
    // For development - use sample data
    if (process.env.NODE_ENV === 'development') {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
      
      let filteredDepartments = [...sampleDepartments];
      
      // Filter by search
      if (params.search) {
        const searchLower = params.search.toLowerCase();
        filteredDepartments = filteredDepartments.filter(dept => 
          dept.name.toLowerCase().includes(searchLower) ||
          dept.code.toLowerCase().includes(searchLower) ||
          dept.headOfDepartment.toLowerCase().includes(searchLower)
        );
      }
      
      // Filter by status
      if (params.status && params.status !== 'all') {
        filteredDepartments = filteredDepartments.filter(dept => dept.status === params.status);
      }
      
      return {
        items: filteredDepartments,
        total: filteredDepartments.length,
        page: params.page || 1,
        pageSize: params.pageSize || 10
      };
    }
    
    // For production - call real API
    const response = await api.get('/department', { params });
    return {
      items: response.data || [],
      total: response.data?.length || 0,
      page: params.page || 1,
      pageSize: params.pageSize || 10
    };
  } catch (error) {
    console.error('Error fetching departments:', error);
    return null;
  }
};

// Get department by ID
export const getDepartmentById = async (id) => {
  try {
    // For development
    if (process.env.NODE_ENV === 'development') {
      await new Promise(resolve => setTimeout(resolve, 300));
      return sampleDepartments.find(dept => dept.id === parseInt(id));
    }
    
    const response = await api.get(`/department/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching department ${id}:`, error);
    throw error;
  }
};

// Create new department
export const createDepartment = async (departmentData) => {
  try {
    // For development
    if (process.env.NODE_ENV === 'development') {
      await new Promise(resolve => setTimeout(resolve, 700));
      const newDepartment = {
        ...departmentData,
        id: sampleDepartments.length + 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      console.log('Creating department:', newDepartment);
      return newDepartment;
    }
    
    const response = await api.post('/department/create', departmentData);
    return response.data;
  } catch (error) {
    console.error('Error creating department:', error);
    throw error;
  }
};

// Update department
export const updateDepartment = async (id, departmentData) => {
  try {
    // For development
    if (process.env.NODE_ENV === 'development') {
      await new Promise(resolve => setTimeout(resolve, 600));
      const updatedDepartment = {
        ...departmentData,
        id,
        updatedAt: new Date().toISOString()
      };
      console.log('Updating department:', updatedDepartment);
      return updatedDepartment;
    }
    
    const dataWithId = { ...departmentData, id };
    const response = await api.put('/department/update', dataWithId);
    return response.data;
  } catch (error) {
    console.error(`Error updating department ${id}:`, error);
    throw error;
  }
};

// Delete department
export const deleteDepartment = async (id) => {
  try {
    // For development
    if (process.env.NODE_ENV === 'development') {
      await new Promise(resolve => setTimeout(resolve, 800));
      console.log('Deleting department with ID:', id);
      return true;
    }
    
    const response = await api.delete(`/department/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting department ${id}:`, error);
    return null;
  }
};