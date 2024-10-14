import { configureStore } from '@reduxjs/toolkit';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import rootReducer from './reducers'; // Ensure this path is correct

const store = configureStore({
    reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = ThunkDispatch<RootState, unknown, any>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, any>;

export default store;