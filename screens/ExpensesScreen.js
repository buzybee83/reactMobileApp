import React, { useEffect, useContext, useState } from 'react';
import {
	SafeAreaView,
	Text,
	StyleSheet,
} from 'react-native';
import {
	ActivityIndicator,
	Divider,
	Provider,
	Portal,
	Modal
} from 'react-native-paper';
import { Button } from 'react-native-elements';
import { Constants, DarkTheme } from '../constants/Theme';
import { Context as ExpenseContext } from '../context/ExpenseContext';
import { Context as BudgetContext } from '../context/BudgetContext';
import { ButtonIcon } from '../components/Icons';
import ExpenseListView from '../components/ExpenseListView';
import ExpenseForm from '../components/ExpenseForm';

const ExpensesScreen = () => {
	const {
		state,
		fetchExpenses,
		createExpense,
		updateExpenseById,
		deleteExpenseById
	} = useContext(ExpenseContext);
	const { state: { budget } } = useContext(BudgetContext);
	const [expense, setExpense] = useState({});
	const [formTitle, setTitle] = useState('');
	const [listState, setListState] = useState({ isLoading: true, isSaving: false });
	const [modalVisible, setModalVisible] = useState(false);

	const refreshExpenseData = React.useCallback(async () => {
		await fetchExpenses();
		console.log('===DONE REFRESHING===')
	});

	useEffect(() => {
		setListState({ ...listState, isLoading: true });
		try {
			refreshExpenseData();
		} catch(err) {
			console.warn(`Error loading Expenses. ${err}`)
		} finally {
			setListState({ ...listState, isLoading: false });
		}
	}, [!listState.isSaving]);

	const togglePaid =  async (id) => {
		setListState({ ...listState, isSaving: true });
		const updatedItem = state.expenses.filter(item => item._id === id)[0];
		try {
			updatedItem.isPaid = !updatedItem.isPaid;
			await updateExpenseById(updatedItem);
		} catch (err) {
			console.warn('ERROR OCCURED IN SAVING EXPENSE ==', err)
		} finally {
			setListState({ ...listState, isSaving: false });
		}
	};

	const onSubmitExpense = async (data, expenseRef) => {
		setListState({ ...listState, isSaving: true });

		try {
			if (expenseRef && expenseRef._id) {
				expenseRef = {
					...expenseRef,
					...data
				};
				expenseRef.amount = parseFloat(data.amount).toFixed(2);
				expenseRef.frequency.isRecurring = data.isRecurring;
				expenseRef.frequency.recurringType = data.recurringType;
				console.log('expenseRef ==', expenseRef)
				await updateExpenseById(expenseRef);

			} else {
				const newExpense = {
					budgetId: budget._id,
					...data,

					frequency: {
						isRecurring: data.isRecurring,
						recurringType: data.recurringType
					}
				};
				newExpense.amount = parseFloat(data.amount).toFixed(2);
				await createExpense(newExpense);
			}
		} catch (err) {
			console.warn('ERROR OCCURED IN SAVING EXPENSE ==', err)
		} finally {
			hideModal();
			setListState({ ...listState, isSaving: false });
		}
	};

	const deleteExpense = async (id) => {
		try {
			await deleteExpenseById(id);
		} catch (err) {
			console.warn(err);
		} finally {
			if (modalVisible) {
				hideModal();
			}
		}
	};

	const editExpense = (id, title) => {
		const expense = state.expenses.filter(item => item._id == id)[0];
		setExpense(expense);
		openModalForm(null, title);
	};

	const openModalForm = (ev, title) => {
		if (title) setTitle(title);
		else setTitle('Add Expense');
		setModalVisible(true);
	};

	const hideModal = () => {
		setExpense({});
		setModalVisible(false);
	};

	return (
		<SafeAreaView style={styles.container}>
			{listState.isLoading ? 
				<ActivityIndicator animating={true} style={{ paddingVertical: 45 }} color={Constants.primaryColor}/> :
				<>
					<ExpenseListView 
						expenses={state.expenses} 
						onUpdate={togglePaid}
						onDelete={deleteExpense} 
						onViewDetails={editExpense}
					/>
					<Provider>
						<Portal>
							<Modal
								visible={modalVisible}
								contentContainerStyle={styles.modalView}
								onDismiss={hideModal}
							>
								<>
									<Text style={styles.modalTextHeader}>
										{ formTitle }
									</Text>
									<Divider style={{ height: 2 }} />
									{listState.isSaving ?
										<ActivityIndicator animating={true} style={{ paddingVertical: 30 }} /> :
										<ExpenseForm onSubmitForm={onSubmitExpense} expense={expense} onDelete={deleteExpense} />
									}
								</>
							</Modal>
						</Portal>
					</Provider>
					{ modalVisible ? null :
						<Button
							buttonStyle={styles.actionButton}
							raised
							onPress={openModalForm}
							icon={
								<ButtonIcon
									name="md-add"
									size={48}
									position="center"
								/>
							}
						/>
					}
				</>
			}
		</SafeAreaView>
	);
}
const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignContent: 'stretch',
		justifyContent: 'center',
		...DarkTheme
	},
	actionButton: {
		position: 'absolute',
		bottom: 8,
		display: 'flex',
		alignSelf: 'center',
		justifyContent: 'center',
		paddingLeft: 10,
		width: 64,
		height: 64,
		borderRadius: 100,
		backgroundColor: Constants.secondaryColor
	},
	modalView: {
		backgroundColor: 'white',
		padding: 20
	},
	modalTextHeader: {
		fontSize: Constants.fontLarge,
		fontWeight: Constants.fontWeightMedium,
		marginBottom: 12,
		textAlign: "center"
	}
});

export default ExpensesScreen;
