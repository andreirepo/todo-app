// Replace with modern Redux Toolkit async thunks
import { createAsyncThunk } from '@reduxjs/toolkit';

export const fetchTodos = createAsyncThunk(
  'todos/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/todos');
      
      if (!response.ok) {
        return rejectWithValue('Failed to fetch todos');
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addTodoRequest = createAsyncThunk(
  'todos/add',
  async (todoText) => {
    const response = await fetch('/api/todos', {
      method: 'POST',
      body: JSON.stringify({ text: todoText }),
      headers: { 'Content-Type': 'application/json' }
    });
    return await response.json();
  }
);

export const removeTodoRequest = createAsyncThunk(
  'todos/remove',
  async (todoId) => {
    await fetch(`/api/todos/${todoId}`, { method: 'DELETE' });
    return todoId;
  }
);

export const markTodoAsCompletedRequest = createAsyncThunk(
  'todos/complete',
  async (todoId) => {
    const response = await fetch(`/api/todos/${todoId}/completed`, { 
      method: 'POST' 
    });
    return await response.json();
  }
);
