import React, { useEffect, useContext, useState } from 'react';
import { 
	SafeAreaView, 
	Text, 
	StyleSheet, 
	Dimensions, 
	View,
	Animated,
  	Easing
} from 'react-native';
import { 
	ActivityIndicator, 
	Card, 
	List, 
	Divider, 
	Provider, 
	Portal, 
	Modal 
} from 'react-native-paper';
import SwipeActionList from 'react-native-swipe-action-list';
import { Button } from 'react-native-elements';
import { ScrollView } from 'react-native-gesture-handler';
import { Constants, DarkTheme } from '../constants/Theme';
import { Context as ExpenseContext } from '../context/ExpenseContext';
import { Context as BudgetContext } from '../context/BudgetContext';
import { nth } from '../services/utilHelper';
import { ButtonIcon } from '../components/Icons';
import ExpenseForm from '../components/ExpenseForm';
import ItemDetails from '../components/ItemDetails';

const WINDOW_WIDTH = Dimensions.get('window').width;

const ExpensesScreen = ({ navigation }) => {
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
		console.log('===REFRESHING START===')
		await fetchExpenses();
		setListState({ isLoading : false });
		console.log('===DONE REFRESHING===')
	});

	useEffect(() => {
		setListState({ isLoading: true });
		refreshExpenseData();
	}, [state.expense]);

	const openModalForm = () => {
		setModalVisible(true);
	};

	const onSubmitExpense = async (data, expenseRef) => {
		setListState({ isSaving: true });
		
		try {
			if (expenseRef && expenseRef._id) {
				expenseRef = {
					...expenseRef,
					...data
				}
				expenseRef.amount = parseFloat(data.amount).toFixed(2);
				expenseRef.frequency.isRecurring = data.isRecurring;
				expenseRef.frequency.recurringType = data.recurringType;
				console.log('expenseRef ==',expenseRef)
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
				newExpense.amount = parseFloat(data.amount).toFixed(2),
				await createExpense(newExpense);
			}
		} catch (err) {
			console.warn('ERROR OCCURED IN SAVING EXPENSE ==', err)
		} finally {
			setListState({ isSaving: false, accordionExpanded: '' });
			hideModal();
		}
	};

	const toggleAccordion = (key) => {
		if (key === listState.accordionExpanded) {
			setListState({ accordionExpanded: '' });
		} else {
			setListState({ accordionExpanded: key });
		}
	};

	const deleteExpense = async (data) => {
		try {
			setListState({ isSaving: true , accordionExpanded: '' });
			await deleteExpenseById(data._id);
		} catch(err) {
			console.warn(err);
		} finally {
			setListState({ isSaving: false });
			hideModal();
		}
	};

	const onEditExpense = (expense) => {
		setExpense(expense);
		openModalForm();
	};

	const hideModal = () => {
		setExpense({});
		setModalVisible(false);
	};

	const ContentTitle = ({item}) => {
		console.log('item.amount =', item.amount)
		return (
			<View style={styles.accordionTitleContainer}>
				<Text style={styles.titleText}>{item.name}</Text>
				<Text style={styles.titleText}>${ item.amount.toFixed(2)}</Text>
			</View>
		);
	}

	const ContentDescription = ({ day, isPaid, isRecurring }) => {
		const textColor = isPaid ? { color: Constants.successColor } : { color: Constants.errorText };
		return (
			<View style={styles.accordionTitleContainer}>
				<Text style={[styles.infoText, textColor]}>{ isPaid ? 'Paid' : 'Not Paid' }</Text>
				<Text style={styles.infoText}>
					{ `${!isRecurring ? 'One-Time - ' : ''}Due: ${day}${nth(day)} of ${new Date().toLocaleString('default', { month: 'long' })}` }
				</Text>
			</View>
		)
	};

	const ExpenseListView = ({expenses}) => {
		if (expenses.length) {
			return (
				<ScrollView>
					<List.Section>
						{(expenses).map((item, key) => {
							return (
								<List.Accordion
									key={key}
									theme={{ colors: { primary: Constants.primaryColor } }}
									style={styles.accordionContainer}
									title={<ContentTitle item={item}/>}
									left={props => {
										return (
											<ButtonIcon 
												size={28} 
												position="left" 
												{...props} 
												name="documents-outline"  
											/>
										)
									}}
									description={
										<ContentDescription 
											day={item.dueDay} 
											isPaid={item.isPaid}
											isRecurring={item.frequency.isRecurring}  
										/> 
									}
									expanded={listState.accordionExpanded == item._id}
									onPress={() => toggleAccordion(item._id)}>
									<List.Item 
										onPress=""
										style={styles.accordionFormContainer}
										title="Expense"
										description={<ItemDetails item={item} onEdit={onEditExpense} />}
									/>
								</List.Accordion>
							)
						})}
					</List.Section>
				</ScrollView>
			);
		} else {
			return (
				<Card style={styles.contentContainer}>
					<Text style={styles.noItems}>No expenses found.</Text>
				</Card>
			)
		}
	}

	return (
		<SafeAreaView style={styles.container}>
			{listState.isLoading ? <ActivityIndicator animating={true} style={{ paddingVertical: 30 }} /> :
				<>
					<ExpenseListView expenses={state.expenses}></ExpenseListView>

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
		flexDirection: "column"
	},
	cardContainer: {
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
	accordionContainer: {
		paddingStart: 20,
		backgroundColor: 'white', 
		marginBottom: 1,
	},
	accordionTitleContainer: {
		width: '100%',
		display: 'flex',
  		flexDirection: 'row',
  		justifyContent: 'space-between',
	},
	titleText: {
		fontSize: Constants.fontMedium,
		fontWeight: Constants.fontWeightHeavy,
	},
	infoText: {
		fontSize: Constants.fontSmall,
		color: '#4c4c4c',
	},
	infoChip: {
		height: 32,
		marginRight: 0
	},
	accordionFormContainer: {
		borderTopWidth: 1,
		paddingLeft: 16,
		borderTopColor: Constants.whiteColor,
		backgroundColor: 'white', 
		marginBottom: 3
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