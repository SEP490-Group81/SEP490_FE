import axios from 'axios';
import { API_DOMAIN } from '../constants/api/api';
import { getAuth, postAuth, putAuth, deleteAuth } from '../utils/request';

// Token cho authorization
const AUTH_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1laWRlbnRpZmllciI6IjEiLCJlbWFpbCI6ImFkbWluQGhvc3RuYW1lLmNvbSIsImZ1bGxOYW1lIjoiU3VwZXIgVXNlciIsIm5hbWUiOiJTdXBlciIsInN1cm5hbWUiOiJVc2VyIiwiaXBBZGRyZXNzIjoiMC4wLjAuMSIsImF2YXRhclVybCI6IiIsIm1vYmlsZXBob25lIjoiIiwiZXhwIjoxNzgxMjcwNDgzLCJpc3MiOiJodHRwczovL0JFLlNFUDQ5MC5uZXQiLCJhdWQiOiJCRS5TRVA0OTAifQ.kQIX9uvjN9UOPiBitp9JsO2DlPlFyIU4VTP1ZyM4k3Y";

// Cấu hình axios với headers mặc định
const api = axios.create({
  baseURL: 'https://localhost:8175/api/v1',
  headers: {
    'Authorization': `Bearer ${AUTH_TOKEN}`,
    'Content-Type': 'application/json'
  }
});

// Get all users with pagination and optional filters
export const getAllUsers = async (params) => {
  try {
    const response = await api.get(`/user`);;
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    return null;
  }
};

// Get user by ID

export const getUserById = async (id) => {
  try {
    const result = await getAuth(`/user/${id}`);
    console.log(`User with ID ${id} fetched successfully:`, result.result);
    if (!result || !result.result) {
      throw new Error('User data is missing in the response.');
    }

    return result.result;
  } catch (error) {
    console.error(`Error fetching user with ID ${id}:`, error.message);
    throw error;
  }
};

// Create new user
export const createUser = async (userData) => {
  try {
    const result = await postAuth(`/user/create`, userData);
    console.log(`User updated successfully:`, result);
    return result;
  } catch (error) {
    console.error(`Error updating user with ID ${userData.id}:`, error.message);
    throw error;
  }
};

export const updateUser = async (userData) => {
  try {
    console.log("update user : " + JSON.stringify(userData));
    const result = await putAuth(`/user/update`, userData);
    console.log(`User updated successfully:`, result);
    return result;
  } catch (error) {
    console.error(`Error updating user with ID ${userData.id}:`, error.message);
    throw error;
  }
};

// Delete user
export const deleteUser = async (id) => {
  try {
    const response = await api.deleteAuth('/user', id);
    return response.data;
  } catch (error) {
    console.error(`Error deleting user ${id}:`, error);
    return null;
  }
};