import React, { useEffect, useContext, useState, useCallback } from 'react';
import {
	SafeAreaView,
	Text,
	StyleSheet,
	Dimensions,
	Animated,
	Easing
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

const WINDOW_WIDTH = Dimensions.get('window').width;

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
	const [listState, setListState] = useState({ isLoading: true, isSaving: false, accordionExpanded: '' });
	const [modalVisible, setModalVisible] = useState(false);

	const refreshExpenseData = React.useCallback(async () => {
		await fetchExpenses();
		console.log('===DONE REFRESHING===')
	});

	useEffect(() => {
		setListState({ ...listState, isLoading: true });
		refreshExpenseData();
		setListState({ ...listState, isLoading: false });
	}, [!listState.isSaving]);

	const openModalForm = () => {
		setModalVisible(true);
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
			setListState({ ...listState, isSaving: false, accordionExpanded: '' });
		}
	};

	const deleteExpense = async (id) => {
		try {
			setListState({ ...listState, accordionExpanded: '' });
			await deleteExpenseById(id);
		} catch (err) {
			console.warn(err);
		} finally {
			hideModal();
		}
	};

	const toggleExpanded = () => {
		listState.accordionExpanded = !listState.accordionExpanded;
		setListState({ ...listState });
	}

	const onEditExpense = (expense) => {
		setExpense(expense);
		openModalForm();
	};

	const hideModal = () => {
		setExpense({});
		setModalVisible(false);
	};

	return (
		<SafeAreaView style={styles.container}>
			{listState.isLoading && !state.expenses.length? 
				<ActivityIndicator animating={true} style={{ paddingVertical: 30 }} /> :
				<>
					<ExpenseListView 
						expenses={state.expenses} 
						onDelete={deleteExpense} 
						onExpand={toggleExpanded}
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
										Add Expense
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
					{ modalVisible || listState.accordionExpanded ? null :
						<Button
							buttonStyle={styles.actionButton}
							raised
							onPress={openModalForm}
							icon={
								<ButtonIcon
									name="md-add"
									size={48}
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
	contentContainer: {
		alignSelf: 'center',
		flexDirection: "column",
		width: (WINDOW_WIDTH - 25)
	},
	noItems: {
		alignSelf: 'center',
		fontSize: Constants.fontMedium,
	},
	header: {
		position: "absolute",
		top: 130,
		fontSize: 30,
		alignSelf: "center",
		color: '#fff',
		marginBottom: 20
	},
	actionButton: {
		paddingLeft: 12,
		width: 70,
		height: 70,
		justifyContent: 'flex-end',
		position: 'absolute',
		bottom: 16,
		right: 16,
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


// {(state.expenses).map((item, key) => {
// 	{console.log('ITEM =',item)}
// 	<List.Accordion
// 		key={key}
// 		title={item.name}
// 		left={props => <List.Icon {...props} icon="chevron-forward-outline" />}
// 		description={item.dueDay}
// 		expanded={expanded}
// 		onPress={toggleAccordion}>
// 		<List.Item title={item.anount} />
// 	</List.Accordion>
// })}