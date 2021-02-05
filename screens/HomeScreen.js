import React, { useEffect, useContext, useState } from 'react';
import { View, SafeAreaView, Text, StyleSheet, FlatList, Dimensions } from 'react-native';
import { ListItem, Card } from 'react-native-elements';
import { ScrollView } from 'react-native-gesture-handler';
import { Constants, DarkTheme } from '../constants/Theme';
import { Context as BudgetContext } from '../context/BudgetContext';

const WINDOW_WIDTH = Dimensions.get('window').width;
const SCREEN_WIDTH = Dimensions.get('screen').width;

export default function HomeScreen({ navigation }) {
	const { state, fetchBudget } = useContext(BudgetContext);
	const [isRefreshing, setRefreshing] = useState(false);
	useEffect(() => {
		const unsubscribe = navigation.addListener('focus', async () => {
			await fetchBudget();
		});

		return unsubscribe;
	}, [navigation]);
	console.log('ISREFRESHING===', isRefreshing)

	const refreshBudgetData = async () => {
		setRefreshing(true);
		console.log('===REFRESHING===')
		await fetchBudget();
		setRefreshing(false);
	};
	console.log('Budget ==> ', state)

	return (
		<SafeAreaView style={styles.container}>
			<ScrollView>
				<FlatList
					style={{ width: (SCREEN_WIDTH + 5) }}
					data={state?.budget?.monthlyBudget}
					keyExtractor={item => item._id}
					horizontal={true}
					showsVerticalScrollIndicator={false}
					refreshControl={
                        <RefreshControl
                            tintColor={Constants.noticeText}
                            refreshing={isRefreshing}
                            onRefresh={refreshBudgetData}
                        />
                    }
					pagingEnabled={true}
					contentContainerStyle={{ flexGrow: 1, alignSelf: 'center' }}
					renderItem={({ item }) => {
						return (
							<Card
								title={item.month.name}
								containerStyle={{ width: (WINDOW_WIDTH - 25) }}
							>
								<Text>Month Overview</Text>
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
		flex: 1,
		backgroundColor: DarkTheme.darkBackground,
		justifyContent: "center",
		alignItems: "center"
	},
	contentContainer: {
		paddingTop: 30,
	},
	welcomeContainer: {
		alignItems: 'center',
		marginTop: 10,
		marginBottom: 20,
	},
	welcomeImage: {
		width: 100,
		height: 80,
		resizeMode: 'contain',
		marginTop: 3,
		marginLeft: -10,
	},
	getStartedContainer: {
		alignItems: 'center',
		marginHorizontal: 50,
	},
	titleText: {
		fontSize: 18,
		color: 'rgba(96,100,109, 1)',
		lineHeight: 24,
		textAlign: 'center',
	}
});
