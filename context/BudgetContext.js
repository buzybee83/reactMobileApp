import { AsyncStorage } from 'react-native';
import createDataContext from './createDataContext';
import API from '../clientAPI/api';
import { switchNavigation } from '../services/navigationServices';

const budgetReducer = (state, action) => {
	console.log('BUDGETReducer::ACTION === ', action);
	console.log('BUDGETReducer::STATE === ', state);
	switch (action.type) {
		case 'FETCH_BUDGET':
			return action.payload;
		case 'FETCH_INCOME':
			return action.payload;
		case 'FETCH_EXPENSES':
			return action.payload;
		case 'HAS_ERROR':
			return { ...state, errorMessage: action.payload };
		case 'CLEAR_ERROR':
			return { ...state, errorMessage: '' };
		default:
			return state;
	}
};

const createBudget = dispatch => async (settings) => {
	let currentUser = await AsyncStorage.getItem('currentUser');
	currentUser = JSON.parse(currentUser);
	const budget = {
		settings
	};
	try {
		const response = await API.post('api/budget', budget);
		currentUser.budget = response.data._id
		await AsyncStorage.setItem('currentUser', JSON.stringify(currentUser));
		switchNavigation('Main');
	} catch (err) {
		console.log('CREATION ERROR ==== ', err)
		const errorMssg = err.response && err.response.data.errmsg && err.response.data.errmsg.includes('duplicate') ?
			'A budget has already been assiciated with this account.' :
			'Something went wrong while trying to create your account.';
		dispatch({
			type: 'HAS_ERROR',
			payload: errorMssg
		});
	}
};

const updateBudget = dispatch => () => {

};

const fetchBudget = dispatch => async () => {
	const response = await API.get('api/budget');
	console.log('BUDGET FETCHED === ', response.data)
	dispatch({ type: 'FETCH_BUDGET', payload: response.data });
};

const clearError = dispatch => () => {
	dispatch({ type: 'CLEAR_ERROR' });
};

export const { Provider, Context } = createDataContext(
	budgetReducer,
	{ createBudget, updateBudget, fetchBudget, clearError },
	{ budget: null, bills: [], expenses: [] }
)
