// Replace with modern Redux Toolkit async thunks
import { createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';

const API_BASE_URL = process.env.API_URL || '/api';
const API_URL = `${API_BASE_URL}/todo`;

// Helper function to get auth headers
const getAuthHeaders = (token) => ({
  'Content-Type': 'application/json',
  ...(token && { 'Authorization': `Bearer ${token}` })
});

export const fetchTodos = createAsyncThunk(
  'todos/fetchAll',
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const response = await fetch(API_URL, {
        headers: getAuthHeaders(token)
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          toast.error('Session expired. Please login again.');
        }
        return rejectWithValue('Failed to fetch todos');
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      toast.error('Network error occurred');
      return rejectWithValue(error.message);
    }
  }
);

export const addTodoRequest = createAsyncThunk(
  'todos/add',
  async (todoText, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const response = await fetch(API_URL, {
        method: 'POST',
        body: JSON.stringify({ text: todoText }),
        headers: getAuthHeaders(token)
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          toast.error('Session expired. Please login again.');
        }
        return rejectWithValue('Failed to add todo');
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      toast.error('Failed to add todo');
      return rejectWithValue(error.message);
    }
  }
);

export const removeTodoRequest = createAsyncThunk(
  'todos/remove',
  async (todoId, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const response = await fetch(`${API_URL}/${todoId}`, { 
        method: 'DELETE',
        headers: getAuthHeaders(token)
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          toast.error('Session expired. Please login again.');
        }
        return rejectWithValue('Failed to remove todo');
      }
      
      return todoId;
    } catch (error) {
      toast.error('Failed to remove todo');
      return rejectWithValue(error.message);
    }
  }
);

export const markTodoAsCompletedRequest = createAsyncThunk(
  'todos/complete',
  async (todoId, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const response = await fetch(`${API_URL}/${todoId}/completed`, { 
        method: 'POST',
        headers: getAuthHeaders(token)
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          toast.error('Session expired. Please login again.');
        }
        return rejectWithValue('Failed to mark todo as completed');
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      toast.error('Failed to complete todo');
      return rejectWithValue(error.message);
    }
  }
);
