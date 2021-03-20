import React from 'react';
// import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { TabBarIcon } from '../components/Icons';
import { BudgetStack } from './BudgetStack';
import { ExpenseStack } from './ExpenseStack';
import AccountScreen from '../screens/AccountScreen';
import { Constants } from '../constants/Theme';

const BottomTab = createBottomTabNavigator();
const INITIAL_ROUTE_NAME = 'Home';

export default function HomeStack({ navigation }) {
	// navigation.setOptions({ statusBarStyle: 'dark-content' });
	return (
		<BottomTab.Navigator
			headerMode="none"
			initialRouteName={INITIAL_ROUTE_NAME}
			tabBarOptions={{
				activeTintColor: Constants.tintColor
            }}
		>
			<BottomTab.Screen
				name="Expenses"
				component={ExpenseStack}
				options={{
					tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-medkit" />,
				}}
			/>
			<BottomTab.Screen
				name="Home"
				component={BudgetStack}
				options={{
					tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-home" />,
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


