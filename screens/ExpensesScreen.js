import React, { useEffect, useContext, useState } from 'react';
import { SafeAreaView, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { ActivityIndicator, List, Divider, Provider, Portal, Modal } from 'react-native-paper';
import { Card, Button } from 'react-native-elements';
import { ScrollView } from 'react-native-gesture-handler';
import { Constants, DarkTheme } from '../constants/Theme';
import { Context as ExpenseContext } from '../context/ExpenseContext';
import { Context as BudgetContext } from '../context/BudgetContext';
import { ButtonIcon } from '../components/Icons';

import ExpenseForm from '../components/ExpenseForm';

import Spacer from '../components/Spacer';
const WINDOW_WIDTH = Dimensions.get('window').width;

const ExpensesScreen = ({ navigation }) => {
	const { state, fetchExpenses, createExpense } = useContext(ExpenseContext);
	const { state: { budget } } = useContext(BudgetContext);
	const [isLoading, setIsLoading] = useState(true);
	const [isSaving, setIsSaving] = useState(false);
	const [modalVisible, setModalVisible] = useState(false);
	const [expanded, setExpanded] = useState(false);

	const getEpensesData = React.useCallback(async () => {
		console.log('===REFRESHING===')
		setIsLoading(true);
		await fetchExpenses();
		setIsLoading(false);
		console.log('===DONE REFRESHING===')
	});

	const refreshExpenseData = React.useCallback(async () => {
		console.log('===REFRESHING===')
		setIsLoading(true);
		await fetchExpenses();
		setIsLoading(false);
		console.log('===DONE REFRESHING===')
	});

	useEffect(() => {
		refreshExpenseData();
	}, [!isSaving])

	const openModalForm = () => {
		setIsSaving(false);
		setModalVisible(true);
	};

	const onSubmitExpense = async (data) => {
		setIsSaving(true);
		console.log('NEW EXPENSE ==> ', data)
		const newExpense = {
			...data,
			amaunt: parseInt(data.amount),
			budgetId: budget._id,
			frequency: {
				isRecurring: data.isRecurring,
				recurringType: parseInt(data.recurringType)
			}
		};
		console.log(newExpense)
		await createExpense(newExpense)
		setIsSaving(false);
		setModalVisible(false);
	};

	const toggleAccordion = () => {
		setExpanded(!expanded);
	}

	const getTitle = (item) => {
		return (
			<>
				<Text>{item.name}</Text>
				<Text>{item.amount}</Text>
			</>
		)
	}

	const ApplyView = () => {
		if (state.expenses.length) {
			return (
				<ScrollView>
					<List.Section>
						{(state.expenses).map((item, key) => {
							{console.log('ITEM =',item)}
							<List.Accordion
								key={key}
								title={item.name}
								left={props => <List.Icon {...props} icon="chevron-forward-outline" />}
								description={item.dueDay}
								expanded={expanded}
								onPress={toggleAccordion}>
								<List.Item title={item.anount} />
							</List.Accordion>
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
		setModalVisible(false);
	}

	return (
		<SafeAreaView style={styles.container}>
			{isLoading ? <ActivityIndicator animating={true} style={{ paddingVertical: 30 }} /> :
				<>
					<ApplyView></ApplyView>
					<Provider>
						<Portal>
							<Modal visible={modalVisible}
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
										<ExpenseForm onSubmitForm={onSubmitExpense} />
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
