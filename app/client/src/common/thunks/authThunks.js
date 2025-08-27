import { createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';

const API_BASE_URL = process.env.API_URL || '/api';

// Helper function to get auth headers
const getAuthHeaders = (token) => ({
  'Content-Type': 'application/json',
  ...(token && { 'Authorization': `Bearer ${token}` })
});

// Register user
export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(userData)
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data.errors 
          ? data.errors.map(error => error.msg).join(', ')
          : data.msg || 'Registration failed';
        toast.error(errorMessage);
        return rejectWithValue(errorMessage);
      }

      toast.success('Registration successful!');
      return data;
    } catch (error) {
      const errorMessage = 'Network error occurred';
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

// Login user
export const loginUser = createAsyncThunk(
  'auth/login',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(userData)
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data.errors 
          ? data.errors.map(error => error.msg).join(', ')
          : data.msg || 'Login failed';
        toast.error(errorMessage);
        return rejectWithValue(errorMessage);
      }

      return data;
    } catch (error) {
      const errorMessage = 'Network error occurred';
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

// Load user
export const loadUser = createAsyncThunk(
  'auth/loadUser',
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      
      if (!token) {
        return rejectWithValue('No token found');
      }

      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: getAuthHeaders(token)
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.msg || 'Failed to load user');
      }

      return data;
    } catch (error) {
      return rejectWithValue('Network error occurred');
    }
  }
);

// Logout user
export const logoutUser = createAsyncThunk(
  'auth/logout',
  async () => {
    return {};
  }
);