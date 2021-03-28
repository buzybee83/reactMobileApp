import React, { useState, useCallback } from 'react';
import {
	Text,
	StyleSheet,
	View,
    Dimensions,
	Animated,
	Easing
} from 'react-native';
import {
	Card,
	List,
} from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import SwipeActionList from 'react-native-swipe-action-list';
import { Constants } from '../constants/Theme';
import { nth } from '../services/utilHelper';
import { ButtonIcon } from '../components/Icons';
import ItemDetails from '../components/ItemDetails';

const WINDOW_WIDTH = Dimensions.get('window').width;

const ExpenseListView = ({ expenses, onDelete, onExpand }) => {
    [expanded, setExpanded] = useState('');

    const ContentTitle = ({ item }) => {
		return (
			<View style={styles.accordionTitleContainer}>
				<Text style={styles.titleText}>{item.name}</Text>
				<Text style={styles.titleText}>${item.amount.toFixed(2)}</Text>
			</View>
		);
	}

	const ContentDescription = ({ day, isPaid, isRecurring }) => {
		const textColor = isPaid ? { color: Constants.successColor } : { color: Constants.errorText };
		return (
			<View style={styles.accordionTitleContainer}>
				<Text style={[styles.infoText, textColor]}>{isPaid ? 'Paid' : 'Not Paid'}</Text>
				<Text style={styles.infoText}>
					{`${!isRecurring ? 'One-Time - ' : ''}Due: ${day}${nth(day)} of ${new Date().toLocaleString('default', { month: 'long' })}`}
				</Text>
			</View>
		)
	};

	const PaidRowBack = () => (
		<View style={styles.leftHiddenContainer}>
			<MaterialIcons
				size={32}
				name="check"
			/>
		</View>
	);

	const TrashRowBack = () => (
		<View style={styles.rightHiddenContainer}>
			<MaterialIcons
				name="delete"
				size={32}
			/>
		</View>
	);

    const toggleAccordion = (key) => {
		console.log(key == expanded)
        onExpand && onExpand();

		if (key == expanded) {
			setExpanded({ expanded: '' });
			console.log('clearing ', expanded)
		} else {
			setExpanded({ expanded: key });
			console.log(expanded);
		}
	};

	const itemToId = useCallback(item => item._id, []);

	const renderAccordionItem = useCallback(data => {
		const item = data.item;
		return (
			<List.Accordion
				theme={{ colors: { primary: Constants.primaryColor } }}
				style={styles.accordionContainer}
				title={<ContentTitle item={item} />}
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
				expanded={expanded === item._id}
				onPress={() => toggleAccordion(item._id)}>
				<List.Item
					style={styles.accordionFormContainer}
					title="Expense"
					description={<ItemDetails item={item} />}
				/>
			</List.Accordion>
		);
	}, []);

    if (expenses.length) {
        return (
            <List.Section>
                <SwipeActionList
                    keyExtractor={itemToId}
                    data={expenses}
                    renderItem={renderAccordionItem}
                    renderLeftHiddenItem={PaidRowBack}
                    renderRightHiddenItem={TrashRowBack}
                    onSwipeLeft={onDelete}
                />
            </List.Section>
        );
    } else {
        return (
            <Card style={styles.contentContainer}>
                <Text style={styles.noItems}>No expenses found.</Text>
            </Card>
        )
    }
};

const styles = StyleSheet.create({
	contentContainer: {
		alignSelf: 'center',
		flexDirection: "column",
		width: (WINDOW_WIDTH - 25),
        height: '10%',
        marginTop: 8,
        paddingTop: 24
	},
	noItems: {
		alignSelf: 'center',
		fontSize: Constants.fontMedium,
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
	leftHiddenContainer: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
	},
	rightHiddenContainer: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'flex-end',
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
    }
});

export default ExpenseListView;