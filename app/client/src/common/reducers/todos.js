import { createSlice } from '@reduxjs/toolkit';
import { 
  fetchTodos, 
  addTodoRequest, 
  removeTodoRequest, 
  markTodoAsCompletedRequest 
} from '../thunks/thunks';

const initialState = { isLoading: false, data: [] };

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handle fetchTodos
      .addCase(fetchTodos.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(fetchTodos.rejected, (state) => {
        state.isLoading = false;
      })
      
      // Handle addTodoRequest
      .addCase(addTodoRequest.fulfilled, (state, action) => {
        state.data.unshift(action.payload);
      })
      
      // Handle removeTodoRequest
      .addCase(removeTodoRequest.fulfilled, (state, action) => {
        state.data = state.data.filter(todo => todo._id !== action.payload);
      })
      
      // Handle markTodoAsCompletedRequest
      .addCase(markTodoAsCompletedRequest.fulfilled, (state, action) => {
        const updatedTodo = action.payload;
        const index = state.data.findIndex(todo => todo._id === updatedTodo._id);
        if (index !== -1) {
          state.data[index] = updatedTodo;
        }
      });
  }
});

export const todos = todosSlice.reducer;
