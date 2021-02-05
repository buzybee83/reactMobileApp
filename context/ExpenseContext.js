import { AsyncStorage } from 'react-native';
import createDataContext from './createDataContext';
import API from '../clientAPI/api';
import { switchNavigation } from '../services/navigationServices';

const expenseReducer = (prevState, action) => {
	console.log('EXPENSEReducer::ACTION === ', action);
	console.log('EXPENSEReducer::STATE === ', prevState);
	switch (action.type) {
		case 'FETCH_EXPENSES':
			return { ...prevState, expenses: action.payload };
		case 'HAS_ERROR':
			return { ...prevState, errorMessage: action.payload };
		case 'CLEAR_ERROR':
			return { ...prevState, errorMessage: '' };
		default:
			return prevState;
	}
};

const createExpense = dispatch => async (settings) => {
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
		console.log('CREATION ERROR ==== \n', err)
		const errorMssg = err.response && err.response.data.errmsg && err.response.data.errmsg.includes('duplicate') ?
			'A budget has already been associated with this account.' :
			'Something went wrong while trying to create your account.';
		dispatch({
			type: 'HAS_ERROR',
			payload: errorMssg
		});
	}
};

const updateExpense = dispatch => () => {

};

const fetchExpenses = dispatch => async () => {
	const response = await API.get('api/budget');
	console.log('BUDGET FETCHED === ', response.data)
	dispatch({ type: 'FETCH_BUDGET', payload: response.data });
};

const fetchExpenseById = dispatch => async () => {
	const response = await API.get('api/budget');
	console.log('BUDGET FETCHED === ', response.data)
	dispatch({ type: 'FETCH_BUDGET', payload: response.data });
};

const clearError = dispatch => () => {
	dispatch({ type: 'CLEAR_ERROR' });
};

export const { Provider, Context } = createDataContext(
	expenseReducer,
	{ createExpense, updateExpense, fetchExpenses, fetchExpenseById, clearError },
	{ expenses: [] }
)
