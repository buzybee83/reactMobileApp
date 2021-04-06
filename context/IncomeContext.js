import { AsyncStorage } from 'react-native';
import createDataContext from './createDataContext';
import API from '../clientAPI/api';

const incomeReducer = (prevState, action) => {
	// console.log('EXPENSEReducer::ACTION === ', action);
	// console.log('EXPENSEReducer::STATE === ', prevState);
	switch (action.type) {
		case 'FETCH_INCOME':
			return { ...prevState, income: action.payload };
		case 'UPDATE_INCOME':
			prevState.income = prevState.income.map(x => {
				if (x._id == action.payload._id) {
					x = action.payload;
				}
				return x;
			});
			return { ...prevState };
		case 'DELETED_INCOME':
			return { ...prevState, income: prevState.income.filter(x => x._id !== action.payload.id) };
		case 'HAS_ERROR':
			return { ...prevState, errorMessage: action.payload };
		case 'CLEAR_ERROR':
			return { ...prevState, errorMessage: '' };
		default:
			return prevState;
	}
};

const createIncome = dispatch => async (data) => {
	const currentUser = await AsyncStorage.getItem('currentUser');
	const { budgetId } = JSON.parse(currentUser);
	data.budgetId = budgetId;
	try {
		const response = await API.post(`/api/${budgetId}/income`, data);
		dispatch({
			type: 'UPDATE_INCOME',
			payload: response.data
		});
	} catch (err) {
		const errorMssg = err.response && err.response.data.errmsg && err.response.data.errmsg.includes('duplicate') ?
			'An income with the same name already existst. Try changing the name.' :
			'Something went wrong while trying to add income.';
		dispatch({
			type: 'HAS_ERROR',
			payload: errorMssg
		});
		console.error('CREATION ERROR ==== \n', err)
	}
};

const updateIncomeById = dispatch => async (income) => {
	const currentUser = await AsyncStorage.getItem('currentUser');
	const { budgetId } = JSON.parse(currentUser);
	try {
		const response = await API.post(`api/${budgetId}/income/${income._id}`, income);
		dispatch({
			type: 'FETCH_INCOME',
			payload: response.data
		});
	} catch (err) {
		const errorMssg = 'Something went wrong while trying to delete this income.';
		dispatch({
			type: 'HAS_ERROR',
			payload: errorMssg
		});
		console.error('UPDATE ERROR ==== \n', err)
	}
};

const fetchIncome = dispatch => async () => {
	const currentUser = await AsyncStorage.getItem('currentUser');
	const { budgetId } = JSON.parse(currentUser);
	const response = await API.get(`/api/${budgetId}/income`);
	dispatch({ type: 'FETCH_INCOME', payload: response.data });
};

const fetchIncomeById = dispatch => async (id) => {
	const currentUser = await AsyncStorage.getItem('currentUser');
	const { budgetId } = JSON.parse(currentUser);

	const response = await API.get(`api/${budgetId}/income/${id}`);
	dispatch({ type: 'FETCH_INCOME ', payload: response.data });
};

const deleteIncomeById = dispatch => async (id) => {
	const currentUser = await AsyncStorage.getItem('currentUser');
	const { budgetId } = JSON.parse(currentUser);
	try {
		await API.delete(`api/${budgetId}/income/${id}`);
		dispatch({ type: 'DELETED_INCOME', payload: { id }  });
	} catch (err) {
		const errorMssg = 'Something went wrong while trying to delete this income.';
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
	incomeReducer,
	{ createIncome, fetchIncome, fetchIncomeById, updateIncomeById, deleteIncomeById, clearError },
	{ income: null, errorMessage: '' }
)
