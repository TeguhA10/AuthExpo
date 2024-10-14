import axios, { AxiosError } from 'axios';
import { Dispatch } from 'redux';
import { setCredentials, logout, setLoading, setError } from '../store/reducers/authReducers';
import { jwtDecode } from 'jwt-decode';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const BASE_URL = 'http://192.168.100.133:5000/api/';

interface Credentials {
    username: string;
    password: string;
}

interface UserData {
    name: string;
    username: string;
    email: string;
    password: string;
}

export interface Token {
    id: string;
    name: string;
    username: string;
    email: string;
    exp: number;
    [key: string]: any;
}

const TOKEN_KEY = 'token';

export const getTokenFromStorage = async (): Promise<string | null> => {
    try {
        const token = await AsyncStorage.getItem(TOKEN_KEY);
        return token;
    } catch (error) {
        console.error('Failed to retrieve token from storage:', error);
        return null;
    }
};

const storeToken = async (token: string) => {
    try {
        await AsyncStorage.setItem(TOKEN_KEY, token);
    } catch (error) {
        console.error('Failed to store token in storage:', error);
    }
};

const removeToken = async () => {
    try {
        await AsyncStorage.removeItem(TOKEN_KEY);
    } catch (error) {
        console.error('Failed to remove token from storage:', error);
    }
};

export const login = (credentials: Credentials) => async (dispatch: Dispatch) => {
    dispatch(setLoading(true));
    try {
        const response = await axios.post(`${BASE_URL}login`, credentials, {
            withCredentials: true
        });

        const token = response.data.token;

        if (token) {
            await storeToken(token);
            dispatch(setCredentials({ token }));
        } else {
            console.log('Token not found in response after login');
        }

        dispatch(setLoading(false));
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.log('Login failed:', error.response?.data);
            dispatch(setError('Login failed: ' + (error.response?.data.message || 'Unknown error')));
        } else {
            console.log('Login failed:', (error as Error).message);
            dispatch(setError('Login failed: ' + (error as Error).message));
        }

        dispatch(setLoading(false));
    }
};

export const register = (userData: UserData) => async (dispatch: Dispatch) => {
    dispatch(setLoading(true));
    try {
        const response = await axios.post(`${BASE_URL}register`, userData, {
            withCredentials: true
        });

        const token = response.data.token;

        if (token) {
            await storeToken(token);
            dispatch(setCredentials({ token }));
        } else {
            console.log('Token not found in response after registration');
        }

        dispatch(setLoading(false));
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.log('Register failed:', error.response?.data);
            dispatch(setError('Register failed: ' + (error.response?.data.message || 'Unknown error')));
        } else {
            console.log('Register failed:', (error as Error).message);
            dispatch(setError('Register failed: ' + (error as Error).message));
        }

        dispatch(setLoading(false));
    }
};

export const checkTokenExpiration = () => async (dispatch: Dispatch) => {
    dispatch(setLoading(true));
    const token = await getTokenFromStorage();
    if (token) {
        const decoded = jwtDecode<Token>(token);
        const currentTime = Date.now() / 1000;

        if (decoded.exp < currentTime) {
            dispatch(logout());
            await removeToken();
        } else {
            dispatch(setCredentials({ token }));
        }
    }
    dispatch(setLoading(false));
};

export const logoutApp = () => async (dispatch: Dispatch) => {
    dispatch(setLoading(true));

    try {
        await removeToken();
        dispatch(logout());
    } catch (err) {
        console.error('Failed to remove token:', err);
        dispatch(setError('Failed to log out'));
    }

    dispatch(setLoading(false));
};
