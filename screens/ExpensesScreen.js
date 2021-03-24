import React, { useEffect, useContext, useState } from 'react';
import { SafeAreaView, Text, StyleSheet, Dimensions, View } from 'react-native';
import { ActivityIndicator, List, Divider, Provider, Portal, Modal } from 'react-native-paper';
import { Card, Button } from 'react-native-elements';
import { ScrollView } from 'react-native-gesture-handler';
import { Constants, DarkTheme } from '../constants/Theme';
import { Context as ExpenseContext } from '../context/ExpenseContext';
import { Context as BudgetContext } from '../context/BudgetContext';
import { nth } from '../services/utilHelper';
import { ButtonIcon } from '../components/Icons';

import ExpenseForm from '../components/ExpenseForm';
import ItemDetails from '../components/ItemDetails';

import Spacer from '../components/Spacer';
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
	const [isLoading, setIsLoading] = useState(true);
	const [isSaving, setIsSaving] = useState(false);
	const [modalVisible, setModalVisible] = useState(false);
	const [expanded, setExpanded] = useState('');
	const [isAccordionExpanded, setAccordionExpanded] = useState(false);

	const refreshExpenseData = React.useCallback(async () => {
		console.log('===REFRESHING START===')
		setIsLoading(true);
		await fetchExpenses();
		setIsLoading(false);
		console.log('===DONE REFRESHING===')
	});

	useEffect(() => {
		refreshExpenseData();
	}, [!isSaving])

	const openModalForm = () => {
		setModalVisible(true);
	};

	const onSubmitExpense = async (data, expenseRef) => {
		setIsSaving(true);
		
		try {
			if (expenseRef && expenseRef._id) {
				expenseRef = {
					...expenseRef,
					...data
				}
				expenseRef.frequency.isRecurring = data.isRecurring;
				expenseRef.frequency.recurringType = data.recurringType;
				await updateExpenseById(expenseRef);
				
			} else {
				const newExpense = {
					...data,
					budgetId: budget._id,
					frequency: {
						isRecurring: data.isRecurring,
						recurringType: data.recurringType
					}
				};
				await createExpense(newExpense);
			}
		} catch (err) {
			console.warn('ERROR OCCURED IN SAVING EXPENSE ==', err)
		} finally {
			setExpanded('');
			setExpense({});
			setAccordionExpanded(false);
			setModalVisible(false);
			setIsSaving(false);
		}
	};

	const toggleAccordion = (key) => {
		if (key === expanded) {
			setExpanded('')
			setAccordionExpanded(false)
		} else {
			setExpanded(key)
			setAccordionExpanded(true)
		}
	}

	const getTitle = (item) => {
		return (
			<View style={styles.accordionTitleContainer}>
				<Text style={styles.titleText}>{item.name}</Text>
				<Text style={styles.titleText}>${item.amount}</Text>
			</View>
		)
	}

	const deleteExpense = async (data) => {
		setIsSaving(true);
		await deleteExpenseById(data._id);
		setExpanded('');
		setExpense({});
		setAccordionExpanded(false);
		setModalVisible(false);
	};

	const getDueDateDescription = (day) => {
		return `Due on the ${day}${nth(day)} of ${new Date().toLocaleString('default', { month: 'long' })}`
	};

	const onEditExpense = (expense) => {
		setExpense(expense);
		openModalForm();
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
									title={getTitle(item)}
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
									description={getDueDateDescription(item.dueDay)}
									expanded={expanded == item._id}
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

	const hideModal = () => {
		setExpense({});
		setModalVisible(false);
	}

	return (
		<SafeAreaView style={styles.container}>
			{isLoading ? <ActivityIndicator animating={true} style={{ paddingVertical: 30 }} /> :
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
									{isSaving ?
										<ActivityIndicator animating={true} style={{ paddingVertical: 30 }} /> :
										<ExpenseForm onSubmitForm={onSubmitExpense} expense={expense} onDelete={deleteExpense} />
									}
								</>
							</Modal>
						</Portal>
					</Provider>
					{ modalVisible || isAccordionExpanded ? null :
						<Button
							buttonStyle={styles.actionButton}
							raised
							onPress={openModalForm}
							icon={
								<ButtonIcon
									name="md-add"
									size={48}
									color={Constants.whiteColor}
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
		backgroundColor: Constants.primaryColor
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