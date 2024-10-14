import { combineReducers } from 'redux';
import authReducers from './authReducers';
import apiReducers from './apiReducers';

const rootReducer = combineReducers({
    auth: authReducers,
    api: apiReducers,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;