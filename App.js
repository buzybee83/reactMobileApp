import React from 'react';
import { AsyncStorage } from 'react-native';
import { Platform, StatusBar } from 'react-native';
import { SplashScreen } from 'expo';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { Provider as AuthProvider } from './context/AuthContext';
import { Provider as BudgetProvider } from './context/BudgetContext';
import AuthNavigator from './navigation/AuthNavigator';
import IntroNavigator from './navigation/IntroNavigator';
import BottomTabNavigator from './navigation/BottomTabNavigator';
import useLinking from './navigation/useLinking';
import { setTopNavigator } from './services/navigationServices';

const Stack = createStackNavigator();

export default function App({ navigation, ...props }) {
	const [isLoadingComplete, setLoadingComplete] = React.useState(false);
	const [initialNavigationState, setInitialNavigationState] = React.useState();
	const containerRef = React.useRef();
	const { getInitialState } = useLinking(containerRef);
	const [isAuthenticated, setAuthState] = React.useState(false);
	const [initialRoute, setInitialRoute] = React.useState('Login');
	const [barTheme, setBarTheme] = React.useState('light-content')
	// Load any resources or data that we need prior to rendering the app
	React.useEffect(() => {
		async function loadResourcesAndDataAsync() {
			try {
				SplashScreen.preventAutoHide();
				// Load our initial navigation state
				setInitialNavigationState(await getInitialState());
				// Load fonts
				await Font.loadAsync({
					...Ionicons.font,
					'roboto-light': require('./assets/fonts/Roboto-Light.ttf'),
					'roboto-light-i': require('./assets/fonts/Roboto-LightItalic.ttf'),
					'roboto': require('./assets/fonts/Roboto-Regular.ttf'),
					'roboto-medium': require('./assets/fonts/Roboto-Medium.ttf'),
					'roboto-medium-i': require('./assets/fonts/Roboto-MediumItalic.ttf'),
					'roboto-bold': require('./assets/fonts/Roboto-Bold.ttf'),
					'roboto-bold-i': require('./assets/fonts/Roboto-BoldItalic.ttf'),
					'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
				});
				// Check User is logged in
				// await AsyncStorage.removeItem('currentUser');
				let currentUser = await AsyncStorage.getItem('currentUser');
				if (currentUser) {
					currentUser = JSON.parse(currentUser);
					setAuthState(true);
					console.log(':::CURRENT USER ::: ', currentUser)
					if (currentUser.budget) {
						setInitialRoute('Main');
						setBarTheme('dark-content');
					} else { 
						setInitialRoute('Intro');
					}
				}
			} catch (e) {
				// We might want to provide this error information to an error reporting service
				console.warn(e);
			} finally {
				setLoadingComplete(true);
				SplashScreen.hide();
			}
		}

		loadResourcesAndDataAsync();

	}, []);

	if (!isLoadingComplete && !props.skipLoadingScreen) {
		return null;
	} else {
		return (
			<AuthProvider value={{ isAuthenticated }}>
				<BudgetProvider>
					{Platform.OS === 'ios' && <StatusBar barStyle={barTheme} />}
					<NavigationContainer
						ref={containerRef => setTopNavigator(containerRef)}
						initialState={initialNavigationState}
					>
						<Stack.Navigator initialRouteName={initialRoute}>
							<Stack.Screen
								name="Auth"
								component={AuthNavigator}
								options={{
									headerLeft: null,
									headerShown: false,
									animationTypeForReplace: isAuthenticated ? 'pop' : 'push',
								}}
							/>
							<Stack.Screen
								name="Intro"
								component={IntroNavigator}
								options={{
									headerLeft: null,
									headerShown: false,
									animationTypeForReplace: 'pop'
								}}
							/>
							<Stack.Screen
								name="Main"
								component={BottomTabNavigator}
								options={{
									headerLeft: null,
									animationTypeForReplace: 'pop	',
								}}
							/>
						</Stack.Navigator>
					</NavigationContainer>
				</BudgetProvider>
			</AuthProvider>
		);
	}
}

