import React, { useEffect, useContext, useState } from 'react';
import { RefreshControl, SafeAreaView, Text, StyleSheet, FlatList, Dimensions } from 'react-native';
import { Card } from 'react-native-elements';
import { ActivityIndicator } from 'react-native-paper';
import { ScrollView } from 'react-native-gesture-handler';
import { Constants, DarkTheme } from '../constants/Theme';
import { Context as BudgetContext } from '../context/BudgetContext';

const WINDOW_WIDTH = Dimensions.get('window').width;
const SCREEN_WIDTH = Dimensions.get('screen').width;
const WINDOW_HEIGHT = Dimensions.get('window').height;

export default function HomeScreen({ navigation }) {
	const { state, fetchBudget, updateBudget } = useContext(BudgetContext);
	const [isRefreshing, setRefreshing] = useState(false);
	// useEffect(() => {
	// 	const unsubscribe = navigation.addListener('focus', async () => {
	// 		await fetchBudget();
	// 	});
	// 	return unsubscribe;
	// }, [navigation]);

	useEffect(() => {
		const refreshBudgetData = async () => {
			console.log('# refreshBudgetData #')
			if (!state.budget) {
				setRefreshing(true);
				await fetchBudget();
				setRefreshing(false);
			}
			if (!state.isCurrent) {
				setRefreshing(true);
				console.log('# UPDATE refreshBudgetData #')
				await updateBudget(state.budget);
				setRefreshing(false);
			}
		}
		refreshBudgetData();
	}, [isRefreshing]);

	console.log('HOMESCREEN Budget STATE ==> ', state)

	return (
		<SafeAreaView style={styles.container}>
			<ScrollView>
				<FlatList
					style={styles.flatlistContainer}
					data={state?.budget?.monthlyBudget}
					keyExtractor={item => item._id}
					horizontal
					legacyImplementation={false}
					showsVerticalScrollIndicator={false}
					pagingEnabled={true}
					contentContainerStyle={styles.contentContainer}
					renderItem={({ item }) => {
						return (
							<Card
								title={item.month.name}
								containerStyle={styles.cardContent}
							>
								{ isRefreshing ? 
									<ActivityIndicator animating={true} style={{paddingVertical: 30}}/> :
									<Text>Month Overview</Text>
								}
							</Card>
						)
					}}
				/>
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		...DarkTheme,
		flex: 1,
		justifyContent: "center",
		alignItems: "center"
	},
	flatlistContainer: {
		width: (SCREEN_WIDTH + 5),  
		height:'100%' 
	},
	contentContainer: {
		flexGrow: 1, 
		alignSelf: 'center'
	},
	cardContent: {
		width: (WINDOW_WIDTH - 25), 
		height: (WINDOW_HEIGHT - 200)
	}
});
/* <ScrollView
				refreshControl={
					<RefreshControl
						tintColor={Constants.primaryColor}
						refreshing={isRefreshing}
						onRefresh={refreshBudgetData}
					/>
				}
			></ScrollView> */
/* <FlatList
	style={styles.flatlistContainer}
	data={state?.budget?.monthlyBudget}
	keyExtractor={item => item._id}
	horizontal
	legacyImplementation={false}
	showsVerticalScrollIndicator={false}
	refreshControl={
		<RefreshControl
			tintColor={Constants.noticeText}
			refreshing={isRefreshing}
			onRefresh={refreshBudgetData}
		/>
	} */