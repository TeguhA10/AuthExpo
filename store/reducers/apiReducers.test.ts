import { configureStore } from '@reduxjs/toolkit';
import reducer, {
    fetchTodos,
    addTodo,
    deleteTodo,
    updateTodo,
    updateChecked
} from './apiReducers';
import AsyncStorage from '@react-native-async-storage/async-storage';

const mockStore = configureStore({ reducer: { api: reducer } });

describe('apiReducers', () => {
    beforeEach(() => {
        AsyncStorage.clear();
    });

    it('should fetch todos', async () => {
        const mockTodos = [{ id: '1', title: 'Test Todo', createdAt: '', updatedAt: '', status: 'unchecked' }];
        await AsyncStorage.setItem('todos', JSON.stringify(mockTodos));

        const result = await mockStore.dispatch(fetchTodos());
        expect(result.payload).toEqual(mockTodos);

        const state = mockStore.getState();
        expect(state.api.todos).toEqual(mockTodos);
        expect(state.api.status).toBe('succeeded');
    });

    it('should add a todo', async () => {
        const newTodo = { id: '1', title: 'New Todo', createdAt: '', updatedAt: '', status: 'unchecked' };

        const result = await mockStore.dispatch(addTodo(newTodo));
        expect(result.payload).toEqual(newTodo);

        const state = mockStore.getState();
        expect(state.api.todos).toEqual([newTodo]);
    });

    it('should delete a todo', async () => {
        const mockTodos = [{ id: '1', title: 'Test Todo', createdAt: '', updatedAt: '', status: 'unchecked' }];
        await AsyncStorage.setItem('todos', JSON.stringify(mockTodos));
        await mockStore.dispatch(fetchTodos());

        const result = await mockStore.dispatch(deleteTodo('1'));
        expect(result.payload).toBe('1');

        const state = mockStore.getState();
        expect(state.api.todos).toEqual([]);
    });

    it('should update a todo', async () => {
        const mockTodos = [{ id: '1', title: 'Test Todo', createdAt: '', updatedAt: '', status: 'unchecked' }];
        await AsyncStorage.setItem('todos', JSON.stringify(mockTodos));
        await mockStore.dispatch(fetchTodos());

        const updatedTodo = { id: '1', title: 'Updated Todo', createdAt: '', updatedAt: '', status: 'unchecked' };
        const result = await mockStore.dispatch(updateTodo(updatedTodo));
        expect(result.payload).toEqual(updatedTodo);

        const state = mockStore.getState();
        expect(state.api.todos[0]).toEqual(updatedTodo);
    });

    it('should update the status of a todo', async () => {
        const mockTodos = [{ id: '1', title: 'Test Todo', createdAt: '', updatedAt: '', status: 'unchecked' }];
        await AsyncStorage.setItem('todos', JSON.stringify(mockTodos));
        await mockStore.dispatch(fetchTodos());

        const result = await mockStore.dispatch(updateChecked({ id: '1', status: 'checked' }));
        expect(result.payload).toEqual({ id: '1', status: 'checked' });

        const state = mockStore.getState();
        expect(state.api.todos[0].status).toBe('checked');
    });
});