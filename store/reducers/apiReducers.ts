import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Todo {
    id: string;
    title: string;
    createdAt: string;
    updatedAt: string;
    status: string;
}

interface ApiState {
    todos: Todo[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: ApiState = {
    todos: [],
    status: 'idle',
    error: null,
};

const STORAGE_KEY = 'todos';

export const fetchTodos = createAsyncThunk('api/fetchTodos', async () => {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
});

export const addTodo = createAsyncThunk('api/addTodo', async (newTodo: Todo, { dispatch }) => {
    const fetchResult = await dispatch(fetchTodos());
    const todos = fetchResult.payload as Todo[];
    const updatedTodos = [...todos, { ...newTodo, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), status: 'unchecked' }]; // Tambahkan status unchecked
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTodos));
    return newTodo;
});

export const deleteTodo = createAsyncThunk('api/deleteTodo', async (id: string, { dispatch }) => {
    const fetchResult = await dispatch(fetchTodos());
    const todos = fetchResult.payload as Todo[];
    const updatedTodos = todos.filter(todo => todo.id !== id);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTodos));
    return id;
});

export const updateTodo = createAsyncThunk('api/updateTodo', async (updatedTodo: Todo, { dispatch }) => {
    const fetchResult = await dispatch(fetchTodos());
    const todos = fetchResult.payload as Todo[];
    const index = todos.findIndex(todo => todo.id === updatedTodo.id);
    if (index !== -1) {
        const updatedTodos = [...todos];
        updatedTodos[index] = { ...updatedTodo, updatedAt: new Date().toISOString() };
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTodos));
        return updatedTodo;
    } else {
        throw new Error('Todo not found');
    }
});

export const updateChecked = createAsyncThunk('api/updateChecked', async ({ id, status }: { id: string; status: 'checked' | 'unchecked' }, { dispatch }) => {
    const fetchResult = await dispatch(fetchTodos());
    const todos = fetchResult.payload as Todo[];
    const index = todos.findIndex(todo => todo.id === id);
    if (index !== -1) {
        const updatedTodos = [...todos];
        updatedTodos[index] = { ...updatedTodos[index], status };
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTodos));
        return { id, status };
    } else {
        throw new Error('Todo not found');
    }
});


const apiReducers = createSlice({
    name: 'api',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchTodos.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchTodos.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.todos = action.payload;
            })
            .addCase(fetchTodos.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message ?? null;
            })
            .addCase(addTodo.fulfilled, (state, action) => {
                state.todos.push(action.payload);
            })
            .addCase(deleteTodo.fulfilled, (state, action) => {
                state.todos = state.todos.filter(todo => todo.id !== action.payload);
            })
            .addCase(updateTodo.fulfilled, (state, action) => {
                const index = state.todos.findIndex(todo => todo.id === action.payload.id);
                if (index !== -1) {
                    state.todos[index] = action.payload;
                }
            })
            .addCase(updateChecked.fulfilled, (state, action) => {
                const { id, status } = action.payload;
                const index = state.todos.findIndex(todo => todo.id === id);
                if (index !== -1) {
                    state.todos[index].status = status; 
                }
            });
    },
});

export default apiReducers.reducer;