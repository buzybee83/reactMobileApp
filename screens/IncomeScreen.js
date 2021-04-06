import React, { useEffect, useContext, useState } from 'react';
import {
	SafeAreaView,
	Text,
	View,
	StyleSheet,
	Modal,
	Alert
} from 'react-native';
import {
	ActivityIndicator,
	Divider,
} from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { Button } from 'react-native-elements';
import { Constants, DarkTheme } from '../constants/Theme';
import { Context as IncomeContext } from '../context/IncomeContext';
import { Context as BudgetContext } from '../context/BudgetContext';
import { ButtonIcon } from '../components/Icons';
import IncomeListView from '../components/IncomeListView';
import IncomeForm from '../components/IncomeForm';
import TotalAmount from '../components/TotalAmount';

const IncomeScreen = () => {
	const {
		state,
		fetchIncome,
		createIncome,
		updateIncomeById,
		deleteIncomeById
	} = useContext(IncomeContext);
	const { state: { budget } } = useContext(BudgetContext);
	const [income, setIncome] = useState(null);
	const [formTitle, setTitle] = useState('');
	const [isActionRequired, setActionRequired] = useState(false);
	const [listState, setListState] = useState({ isLoading: true, isSaving: false });
	const [modalVisible, setModalVisible] = useState(false);

	const refreshIncomeData = React.useCallback(async () => {
		await fetchIncome();
		console.log('===INCOME DONE REFRESHING===')
	});

	useEffect(() => {
		setListState({ ...listState, isLoading: true });
		try {
			refreshIncomeData();
		} catch (err) {
			console.warn(`Error loading Income. ${err}`)
		} finally {
			setListState({ ...listState, isLoading: false });
		}
	}, [!listState.isSaving]);

	const actionRequired = (id) => {
		Alert.alert(
			"Warning",
			"This is part of your recurring monthly income. Do you want to delete this income from the rest of the months?",
			[
				{
					text: "Yes",
					onPress: () => deleteIncome(id),
					style: 'destructive'
				},
				{
					text: "No",
					onPress: () => deleteFromMonth(id),
					style: "default"
				}
			]
		);
	};

	const onSubmitIncome = async (data, incomeRef) => {
		setListState({ ...listState, isSaving: true });

		try {
			if (incomeRef && incomeRef._id) {
				incomeRef = {
					...incomeRef,
					...data
				};
				incomeRef.amount = parseFloat(data.amount).toFixed(2);
				await updateIncomeById(incomeRef);

			} else {
				data.amount = parseFloat(data.amount).toFixed(2);
				await createIncome(data);
			}
		} catch (err) {
			console.warn('ERROR OCCURED IN SAVING EXPENSE - ', err)
		} finally {
			hideModal();
			setListState({ ...listState, isSaving: false });
		}
	};

	const canDelete = (id) => {
		const itemToDelete = state.income.filter(x => x._id == id)[0];
		if (itemToDelete.isAutomated && itemToDelete.incomeType) return false;

		return true;
	}

	const onDelete = (id) => {
		if (canDelete(id)) {
			deleteIncome(id)
		} else {
			actionRequired(id);
		}
	};

	const deleteIncome = async (id) => {
		try {
			// TODO: take out income reference from all months as well
			await deleteIncomeById(id);
		} catch (err) {
			console.warn(err);
		} finally {
			if (modalVisible) {
				hideModal();
			}
		}
	};

	const deleteFromMonth = (id) => {
		// TODO: take out income reference from current month only
	}

	const editIncome = (id, title) => {
		const item = state.income.filter(item => item._id == id)[0];
		setIncome(item);
		openModalForm(null, title);
	};

	const openModalForm = (ev, title) => {
		if (title) setTitle(title);
		else setTitle('Add Income');
		setModalVisible(true);
	};

	const hideModal = () => {
		setIncome(null);
		setModalVisible(false);
	};

	return (
		<SafeAreaView style={styles.container}>
			{listState.isLoading ?
				<ActivityIndicator animating={true} style={{ paddingVertical: 45 }} color={Constants.primaryColor} /> :
				<>
					<View style={{ flex: 1, justifyContent: 'center' }}>
						<TotalAmount items={state.income} paramKey="amount" color={Constants.successColor} />
					</View>
					<View style={{ flex: 8 }}>
						<IncomeListView
							income={state.income}
							onDelete={onDelete}
							onViewDetails={editIncome}
							showPreview={budget.settings.showPreview}
						/>
					</View>
					<Modal
						visible={modalVisible}
						animationType="slide"
						presentationStyle="pageSheet"
						onRequestClose={hideModal}
					>
						<View style={styles.modalView}>
							<Text style={styles.modalTextHeader}>
								{formTitle}
							</Text>
							<MaterialIcons
								style={{ position: 'absolute', right: 8, top: -8 }}
								name="close"
								size={28}
								onPress={hideModal}
							/>
							<Divider style={{ height: 2 }} />
							{listState.isSaving ?
								<ActivityIndicator animating={true} style={{ paddingVertical: 30 }} /> :
								<IncomeForm
									onSubmitForm={onSubmitIncome}
									item={income}
									onDelete={onDelete}
									settings={budget.settings}
								/>
							}
						</View>
					</Modal>
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
		justifyContent: 'space-between',
		...DarkTheme
	},
	actionButton: {
		display: 'flex',
		position: 'absolute',
		bottom: 8,
		alignSelf: 'center',
		justifyContent: 'center',
		paddingLeft: 10,
		width: 64,
		height: 64,
		borderRadius: 100,
		backgroundColor: Constants.secondaryColor
	},
	modalView: {
		flex: 1,
		backgroundColor: 'white',
		marginTop: 20,
		paddingHorizontal: 24
	},
	modalTextHeader: {
		fontSize: Constants.fontLarge,
		fontWeight: Constants.fontWeightMedium,
		marginBottom: 12,
		textAlign: "center"
	}
});

export default IncomeScreen;
