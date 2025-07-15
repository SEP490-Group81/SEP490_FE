import { getAuth, postAuth, putAuth, deleteAuth } from '../utils/request';

// Sample data for fallback (giữ nguyên)
const sampleDepartments = [
  // ... existing sample data
];

// Get all departments with pagination and filters
export const getAllDepartments = async (params = {}) => {
  try {
    // Build query string from params
    const queryParams = new URLSearchParams();
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null) {
        queryParams.append(key, params[key]);
      }
    });
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/department?${queryString}` : '/department';
    
    const response = await getAuth(endpoint);
    
    // Xử lý response data từ backend
    if (Array.isArray(response)) {
      return {
        items: response,
        total: response.length,
        page: params.page || 1,
        pageSize: params.pageSize || 10
      };
    }
    
    if (response && typeof response === 'object') {
      return {
        items: response.data || response.items || response.departments || [],
        total: response.total || response.count || (response.data?.length) || 0,
        page: response.page || params.page || 1,
        pageSize: response.pageSize || params.pageSize || 10
      };
    }
    
    return {
      items: [],
      total: 0,
      page: 1,
      pageSize: 10
    };
    
  } catch (error) {
    console.error('Error fetching departments:', error);
    
    // Fallback to sample data in development
    if (process.env.NODE_ENV === 'development') {
      console.warn('Falling back to sample departments');
      return {
        items: sampleDepartments,
        total: sampleDepartments.length,
        page: 1,
        pageSize: 10
      };
    }
    
    throw new Error(`Failed to fetch departments: ${error.message}`);
  }
};

// Get department by ID
export const getDepartmentById = async (id) => {
  try {
    const response = await getAuth(`/department/${id}`);
    return response;
  } catch (error) {
    console.error(`Error fetching department ${id}:`, error);
    
    if (process.env.NODE_ENV === 'development') {
      const dept = sampleDepartments.find(d => d.id === parseInt(id));
      if (dept) return dept;
    }
    
    throw new Error(`Failed to fetch department: ${error.message}`);
  }
};

// Create new department
export const createDepartment = async (departmentData) => {
  try {
    const response = await postAuth('/department/create', departmentData);
    return response;
  } catch (error) {
    console.error('Error creating department:', error);
    throw new Error(`Failed to create department: ${error.message}`);
  }
};

// Update department
export const updateDepartment = async (id, departmentData) => {
  try {
    const dataWithId = { ...departmentData, id };
    const response = await putAuth('/department/update', dataWithId);
    return response;
  } catch (error) {
    console.error(`Error updating department ${id}:`, error);
    throw new Error(`Failed to update department: ${error.message}`);
  }
};

// Delete department
export const deleteDepartment = async (id) => {
  try {
    const response = await deleteAuth('/department', id);
    return response;
  } catch (error) {
    console.error(`Error deleting department ${id}:`, error);
    throw new Error(`Failed to delete department: ${error.message}`);
  }
};

// Get departments for dropdown/select (simple list)
export const getDepartmentsList = async () => {
  try {
    const response = await getAuth('/department');
    const departments = Array.isArray(response) 
      ? response 
      : response?.data || response?.items || [];
    
    return departments.map(dept => ({
      value: dept.id || dept.code,
      label: dept.name,
      code: dept.code
    }));
  } catch (error) {
    console.error('Error fetching departments list:', error);
    
    if (process.env.NODE_ENV === 'development') {
      return sampleDepartments.map(dept => ({
        value: dept.id,
        label: dept.name,
        code: dept.code
      }));
    }
    
    return [];
  }
};

// Get department statistics
export const getDepartmentStatistics = async () => {
  try {
    const response = await getAuth('/department/statistics');
    return response;
  } catch (error) {
    console.error('Error fetching department statistics:', error);
    
    // Fallback: calculate từ getAllDepartments
    try {
      const allDepts = await getAllDepartments();
      const departments = allDepts.items || [];
      
      return {
        total: departments.length,
        active: departments.filter(d => d.status === 'active').length,
        inactive: departments.filter(d => d.status === 'inactive').length,
        totalStaff: departments.reduce((sum, d) => sum + (d.totalStaff || 0), 0),
        totalBeds: departments.reduce((sum, d) => sum + (d.totalBeds || 0), 0)
      };
    } catch (fallbackError) {
      console.error('Error in fallback statistics:', fallbackError);
      
      if (process.env.NODE_ENV === 'development') {
        return {
          total: sampleDepartments.length,
          active: sampleDepartments.filter(d => d.status === 'active').length,
          inactive: sampleDepartments.filter(d => d.status === 'inactive').length,
          totalStaff: sampleDepartments.reduce((sum, d) => sum + (d.totalStaff || 0), 0),
          totalBeds: sampleDepartments.reduce((sum, d) => sum + (d.totalBeds || 0), 0)
        };
      }
      
      return {
        total: 0,
        active: 0,
        inactive: 0,
        totalStaff: 0,
        totalBeds: 0
      };
    }
  }
};