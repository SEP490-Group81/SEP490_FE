import axios from 'axios';
import { API_DOMAIN } from '../constants/api/api';

// Token cho authorization
const AUTH_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1laWRlbnRpZmllciI6IjEiLCJlbWFpbCI6ImFkbWluQGhvc3RuYW1lLmNvbSIsImZ1bGxOYW1lIjoiU3VwZXIgVXNlciIsIm5hbWUiOiJTdXBlciIsInN1cm5hbWUiOiJVc2VyIiwiaXBBZGRyZXNzIjoiMC4wLjAuMSIsImF2YXRhclVybCI6IiIsIm1vYmlsZXBob25lIjoiIiwiZXhwIjoxNzgxMjcwNDgzLCJpc3MiOiJodHRwczovL0JFLlNFUDQ5MC5uZXQiLCJhdWQiOiJCRS5TRVA0OTAifQ.kQIX9uvjN9UOPiBitp9JsO2DlPlFyIU4VTP1ZyM4k3Y";

// Cấu hình axios với headers mặc định
const api = axios.create({
    headers: {
        'Authorization': `Bearer ${AUTH_TOKEN}`,
        'Content-Type': 'application/json'
    }
});

// Get all users with pagination and optional filters
export const getAllUsers = async (params) => {
    try {
        const response = await api.get(`https://localhost:8175/api/v1/user`, { params });
        return response.data;
    } catch (error) {
        console.error('Error fetching users:', error);
        return null;
    }
};

// Get user by ID
export const getUserById = async (id) => {
    try {
        const response = await api.get(`https://localhost:8175/api/v1/user/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching user ${id}:`, error);
        return null;
    }
};

// Create new user
export const createUser = async (userData) => {
    try {
        const response = await api.post(`https://localhost:8175/api/v1/user`, userData);
        return response.data;
    } catch (error) {
        console.error('Error creating user:', error);
        return null;
    }
};

// Update user
export const updateUser = async (id, userData) => {
    try {
        const response = await api.put(`https://localhost:8175/api/v1/user/${id}`, userData);
        return response.data;
    } catch (error) {
        console.error(`Error updating user ${id}:`, error);
        return null;
    }
};

// Delete user
export const deleteUser = async (id) => {
    try {
        const response = await api.delete(`https://localhost:8175/api/v1/user/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting user ${id}:`, error);
        return null;
    }
};