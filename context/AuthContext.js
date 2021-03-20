import { AsyncStorage } from 'react-native';
import createDataContext from './createDataContext';
import API from '../clientAPI/api';
import { switchNavigation, resetNavigation } from '../services/navigationServices';

const authReducer = (state, action) => {
	console.log('AuthReducer::ACTION === ', action);
	// console.log('AuthReducer::STATE === ', state);
	switch (action.type) {
		case 'RESTORE_TOKEN':
			return { ...state, userToken: action.payload.token, homeScreen: action.payload.homeScreen, isAuthenticated: true };
		case 'LOGIN':
			return { errorMessage: '', userToken: action.payload, homeScreen: action.payload.homeScreen, isAuthenticated: true };
		case 'LOGOUT':
			return { errorMessage: '', userToken: null, isAuthenticated: false };
		case 'HAS_ERROR':
			return { ...state, errorMessage: action.payload, isAuthenticated: false };
		case 'CLEAR_ERROR':
			return { ...state, errorMessage: '' };
		default:
			return state;
	}
};

const clearErrorMessage = dispatch => () => {
	dispatch({ type: 'CLEAR_ERROR' });
};

const signup = dispatch => async ({ firstName, lastName, email, password }) => {
	try {
		const response = await API.post('api/signup', { firstName, lastName, email, password });
		await AsyncStorage.setItem('currentUser', JSON.stringify(response.data));
		dispatch({ type: 'LOGIN', payload: response.data.token });
		switchNavigation('Intro');
	} catch (err) {
		console.log('SIGNUP ERROR ==== ', err)
		const errorMssg = err.response && err.response.data.errmsg && err.response.data.errmsg.includes('duplicate') ?
			'An account with this email already exists. Try loging in or reset your password' :
			'Something went wrong while trying to create your account.';
		dispatch({
			type: 'HAS_ERROR',
			payload: errorMssg
		});
	}
};

const login = dispatch => async ({ email, password }) => {
	try {
		const response = await API.post('api/login', { email, password });
		await AsyncStorage.setItem('currentUser', JSON.stringify(response.data));
		console.log('LOGIN DATA==> ',response.data)
		if (response.data.budgetId) {
			dispatch({ type: 'LOGIN', payload: {token: response.data.token, homeScreen: 'Home' }});
		} else {
			dispatch({ type: 'LOGIN', payload: {token: response.data.token, homeScreen: 'Intro' }});
		}
		// else switchNavigation('Intro');
	} catch (err) {
		console.log('LOGIN ERROR == ', err);
		const errorMssg = err.response && err.response.data.error ?
			err.response.data.error :
			'Something went wrong while tryign to log you in, please try later.';
		dispatch({
			type: 'HAS_ERROR',
			payload: errorMssg
		});
	}
};

const logout = dispatch => async () => {
	try {
		await AsyncStorage.removeItem('currentUser');
		dispatch({ type: 'LOGOUT' });
		resetNavigation();
		// navigate('Auth');
	} catch (err) {
		console.log('LOGOUT ERROR ===> ', err)
		resetNavigation();
	}
};

const bootstrapAuthAsync = dispatch => async () => {
	try {
		let currentUser = await AsyncStorage.getItem('currentUser');
		currentUser = JSON.parse(currentUser);
		console.log(currentUser)
		if (currentUser.budgetId) {
			dispatch({ type: 'RESTORE_TOKEN', payload: {token: currentUser.token, homeScreen: 'Home'} });
		} else {
			dispatch({ type: 'RESTORE_TOKEN', payload: {token: currentUser.token, homeScreen: 'Intro'} });
		}
			
	} catch (err) {
		// No token found!
		resetNavigation();
	}
}

export const { Provider, Context } = createDataContext(
	authReducer,
	{ signup, login, logout, clearErrorMessage, bootstrapAuthAsync },
	{ isAuthenticated: false, homeScreen: '', errorMessage: '' }
);
