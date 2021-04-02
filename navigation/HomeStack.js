import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
// import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { TabBarIcon } from '../components/Icons';
// import { BudgetStack } from './BudgetStack';
// import { ExpenseStack } from './ExpenseStack';
import HomeScreen from '../screens/HomeScreen';
import ExpensesScreen from '../screens/ExpensesScreen';
import AccountScreen from '../screens/AccountScreen';
import { Constants } from '../constants/Theme';

const BottomTab = createBottomTabNavigator();
const INITIAL_ROUTE_NAME = 'Home';
const Stack = createStackNavigator();

const HomeTabs = () => {
	return (
		<BottomTab.Navigator
			initialRouteName={INITIAL_ROUTE_NAME}
			tabBarOptions={{
				activeTintColor: Constants.tintColor
			}}
		>
			<BottomTab.Screen
				name="Home"
				component={HomeScreen}
				options={{
					tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-home" />,
				}}
			/>
			<BottomTab.Screen
				name="Expenses"
				component={ExpensesScreen}
				options={{
					tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-medkit" />,
				}}
			/>
			<BottomTab.Screen
				name="Account"
				component={AccountScreen}
				options={{
					tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-settings" />,
				}}
			/>
		</BottomTab.Navigator>
	);
}

export default function HomeStack({ navigation }) {
	// navigation.setOptions({ statusBarStyle: 'dark-content' });
	return (
		<Stack.Navigator>
			<Stack.Screen
				name="Home"
				component={HomeTabs}
				options={({ route }) => ({
					headerTitle: getHeaderTitle(route),
				})}
			/>
		</Stack.Navigator>
	);
}

function getHeaderTitle(route) {
	// If the focused route is not found, we need to assume it's the initial screen
	// This can happen during if there hasn't been any navigation inside the screen
	// In our case, it's "Home" as that's the first screen inside the navigator
	const routeName = getFocusedRouteNameFromRoute(route) ?? 'Home';

	switch (routeName) {
		case 'Home':
			return 'Month Overview';
		case 'Expenses':
			return 'Monthly Expenses';
		case 'Account':
			return 'My Account';
	}
}


