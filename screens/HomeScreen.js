import React, { useEffect, useContext } from 'react';
import { StatusBar, Image, StyleSheet, Text, View, SafeAreaView } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Context as BudgetContext } from '../context/BudgetContext';

export default function HomeScreen({ navigation }) {
	const { state, fetchBudget } = useContext(BudgetContext);

	StatusBar.setBarStyle('dark-content');

	useEffect(() => {
		const unsubscribe = navigation.addListener('focus', async () => {
			await fetchBudget();
		});

		return unsubscribe;
	}, [navigation]);

	return (

		<SafeAreaView style={styles.container}>
			<ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
				<View style={styles.welcomeContainer}>
					<Image
						source={
							__DEV__
								? require('../assets/images/robot-dev.png')
								: require('../assets/images/robot-prod.png')
						}
						style={styles.welcomeImage}
					/>
					<Text> {console.log('BUDGET STATE >>', state)}</Text>
				</View>

				<View style={styles.getStartedContainer}>
					<Text style={styles.getStartedText}>Create your budget and start your journey here!</Text>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}

HomeScreen.navigationOptions = {
	header: null,
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
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
	getStartedText: {
		fontSize: 17,
		color: 'rgba(96,100,109, 1)',
		lineHeight: 24,
		textAlign: 'center',
	}
});
