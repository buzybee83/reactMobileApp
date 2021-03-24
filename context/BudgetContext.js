import { AsyncStorage } from 'react-native';
import createDataContext from './createDataContext';
import API from '../clientAPI/api';
import { switchNavigation } from '../services/navigationServices';
import { checkActiveMonths } from '../services/utilHelper';

const budgetReducer = (prevState, action) => {
	// console.log('BUDGETReducer::ACTION === ', action);
	// console.log('BUDGETReducer::STATE === ', prevState);
	switch (action.type) {
		case 'FETCH_BUDGET':
			return { ...prevState, budget: action.payload, isCurrent: action.isCurrent, errorMessage: '' };
		case 'UPDATED_BUDGET':
			return { ...prevState, budget: action.payload };
		case 'HAS_ERROR':
			return { ...prevState, errorMessage: action.payload };
		case 'CLEAR_ERROR':
			return { ...prevState, errorMessage: '' };
		default:
			return prevState;
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
		currentUser.budgetId = response.data._id
		await AsyncStorage.setItem('currentUser', JSON.stringify(currentUser));
		switchNavigation('Home');
	} catch (err) {
		console.log('CREATION ERROR ==== \n', err.response.data.error)
		let errorMssg;
		if (err.response) {
			if (err.response.data.error.includes('duplicate')) {
				switchNavigation('Home');
			} else {
				errorMssg = err.response.data.error
				dispatch({
					type: 'HAS_ERROR',
					payload: errorMssg
				});
			}
		} else {
			dispatch({
				type: 'HAS_ERROR',
				payload: 'An error occured. Please try again later.'
			});
		}
	}
};

const updateBudget = dispatch => async (budget) => {
	let currentUser = await AsyncStorage.getItem('currentUser');
	currentUser = JSON.parse(currentUser);
	try {
		const response = await API.post(`api/budget/${currentUser.budgetId}`, budget);
		dispatch({ type: 'UPDATED_BUDGET', payload: response.data, isCurrent: true });
	} catch (err) {
		dispatch({
			type: 'HAS_ERROR',
			payload: err
		});
	}
};

const fetchBudget = dispatch => async () => {
	const response = await API.get('api/budget');
	const { budget, isCurrent } = checkActiveMonths(response.data);
	dispatch({ type: 'FETCH_BUDGET', payload: budget, isCurrent });
};

const clearError = dispatch => () => {
	dispatch({ type: 'CLEAR_ERROR' });
};

export const { Provider, Context } = createDataContext(
	budgetReducer,
	{ createBudget, updateBudget, fetchBudget, clearError },
	{ budget: null, isCurrent: true, errorMessage: '' }
)
