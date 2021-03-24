import { AsyncStorage } from 'react-native';
import createDataContext from './createDataContext';
import API from '../clientAPI/api';
import { switchNavigation } from '../services/navigationServices';

const expenseReducer = (prevState, action) => {
	// console.log('EXPENSEReducer::ACTION === ', action);
	// console.log('EXPENSEReducer::STATE === ', prevState);
	switch (action.type) {
		case 'FETCH_EXPENSES':
			return { ...prevState, expenses: action.payload };
		case 'FETCH_EXPENSE':
			return { ...prevState, expense: action.payload };
		case 'HAS_ERROR':
			return { ...prevState, errorMessage: action.payload };
		case 'CLEAR_ERROR':
			return { ...prevState, errorMessage: '' };
		default:
			return prevState;
	}
};

const createExpense = dispatch => async (data) => {
	try {
		await API.post(`/api/${data.budgetId}/expense`, data);
	} catch (err) {
		const errorMssg = err.response && err.response.data.errmsg && err.response.data.errmsg.includes('duplicate') ?
			'An expense with the same name already existst. Try changing the name.' :
			'Something went wrong while trying to add the expense.';
		dispatch({
			type: 'HAS_ERROR',
			payload: errorMssg
		});
		console.error('CREATION ERROR ==== \n', err)
	}
};

const updateExpenseById = dispatch => async (expense) => {
	console.log('UPDATING')
	const currentUser = await AsyncStorage.getItem('currentUser');
	const { budgetId } = JSON.parse(currentUser);
	try {
		await API.post(`api/${budgetId}/expense/${expense._id}`, expense);
	} catch (err) {
		const errorMssg = 'Something went wrong while trying to delete this expense.';
		dispatch({
			type: 'HAS_ERROR',
			payload: errorMssg
		});
		console.error('UPDATE ERROR ==== \n', err)
	}
};

const fetchExpenses = dispatch => async () => {
	const currentUser = await AsyncStorage.getItem('currentUser');
	const { budgetId } = JSON.parse(currentUser);
	
	const response = await API.get(`/api/${budgetId}/expenses`);
	dispatch({ type: 'FETCH_EXPENSES', payload: response.data });
};

const fetchExpenseById = dispatch => async (id) => {
	const currentUser = await AsyncStorage.getItem('currentUser');
	const { budgetId } = JSON.parse(currentUser);

	const response = await API.get(`api/${budgetId}/expense/${id}`);
	dispatch({ type: 'FETCH_EXPENSE ', payload: response.data });
};

const deleteExpenseById = dispatch => async (id) => {
	const currentUser = await AsyncStorage.getItem('currentUser');
	const { budgetId } = JSON.parse(currentUser);
	try {
		await API.delete(`api/${budgetId}/expense/${id}`);
	} catch (err) {
		const errorMssg = 'Something went wrong while trying to delete this expense.';
		dispatch({
			type: 'HAS_ERROR',
			payload: errorMssg
		});
		console.error('DELETE ERROR ==== \n', err)
	}
};

const clearError = dispatch => () => {
	dispatch({ type: 'CLEAR_ERROR' });
};

export const { Provider, Context } = createDataContext(
	expenseReducer,
	{ createExpense, fetchExpenses, fetchExpenseById, updateExpenseById, deleteExpenseById, clearError },
	{ expenses: [], expense: {}, errorMessage: '' }
)
