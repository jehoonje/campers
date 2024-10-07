// src/redux/todoSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchTodosFromAPI, addTodoToAPI, deleteTodoFromAPI } from '../services/api';

export const fetchTodos = createAsyncThunk('todos/fetchTodos', async () => {
  const response = await fetchTodosFromAPI();
  return response;
});

export const addTodoAsync = createAsyncThunk('todos/addTodo', async (todo) => {
  const response = await addTodoToAPI(todo);
  return response;
});

export const deleteTodoAsync = createAsyncThunk('todos/deleteTodo', async (id) => {
  await deleteTodoFromAPI(id);
  return id;
});

const todoSlice = createSlice({
  name: 'todos',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodos.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addTodoAsync.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(addTodoAsync.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(deleteTodoAsync.fulfilled, (state, action) => {
        state.items = state.items.filter(todo => todo.id !== action.payload);
      })
      .addCase(deleteTodoAsync.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});

export default todoSlice.reducer;
