import { AsyncStorage } from 'react-native';
import createDataContext from './createDataContext';
import clientAPI from '../clientAPI/api';
import { navigate } from '../services/navServices';

const authReducer = (state, action) => {
    console.log('ACTION === ', action)
    switch (action.type) {
        case 'LOGIN':
            return { errorMessage: '', userToken: action.payload, isLoggedIn: true };
        case 'LOGOUT':
            return { errorMessage: '', userToken: null, isLoggedIn: false };
        case 'HAS_ERROR':
            return { ...state, errorMessage: action.payload, isLoggedIn: false };
        case 'CLEAR_ERROR':
            return { ...state, errorMessage: '' };
        default:
            return state;
    }
};

const clearErrorMessage = dispatch => () => {
    dispatch({ type: 'CLEAR_ERROR' });
};

const signup = dispatch => async ({ email, password }) => {
    try {
        const response = await clientAPI.post('/signup', { email, password });
        await AsyncStorage.setItem('userToken', response.data.token);
        dispatch({ type: 'LOGIN', payload: response.data.token });
        navigate('Root');
    } catch (err) {
        const errorMssg = err.response.data.errmsg && err.response.data.errmsg.includes('duplicate') ?
            'An account with this email already exists. Try to login or reset your password' :
            'Something went wrong while trying to create your account.';
        dispatch({
            type: 'HAS_ERROR',
            payload: errorMssg
        });
    }
};

const login = dispatch => async ({ email, password }) => {
    console.log('LOGIN START===', { email, password })
    try {
        const response = await clientAPI.post('/login', { email, password });
        console.log('LOGIN RESPONSE===', response)
        await AsyncStorage.setItem('userToken', response.data.token);
        dispatch({ type: 'LOGIN', payload: response.data.token });
        navigate('Root');
    } catch (err) {
        console.log('LOGIN ERROR == ', err.response.data.error)
        dispatch({
            type: 'HAS_ERROR',
            payload: err.response.data.error
        });
    }
}


const logout = dispatch => async () => {
    try {
        await AsyncStorage.removeItem('userToken');
        dispatch({ type: 'LOGOUT' });
        navigate('Auth');
    } catch (err) {
        console.log('LOGOUT ERROR ===> ', err)
        dispatch({
            type: 'HAS_ERROR',
            payload: err.response.data.error
        });
    }
};

export const { Provider, Context } = createDataContext(
    authReducer,
    { signup, login, logout, clearErrorMessage },
    { isLoggedIn: false, errorMessage: '' }
);
