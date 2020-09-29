import * as React from 'react';
import { StatusBar } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';

const AuthStack = createStackNavigator();
const INITIAL_ROUTE_NAME = 'Login';

export default function AuthNavigator({ navigation, route }) {
	StatusBar.setBarStyle('light-content');

	return (
		<AuthStack.Navigator
			headerMode="none"
			initialRouteName={INITIAL_ROUTE_NAME}>
			<AuthStack.Screen
				name="Login"
				options={{
					headerLeft: null
				}}
				component={LoginScreen}
			/>
			<AuthStack.Screen
				name="Signup"
				component={SignupScreen}
			/>
		</AuthStack.Navigator>
	);
}

AuthNavigator.navigationOptions = {
	header: null,
}

