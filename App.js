import 'react-native-gesture-handler';
import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { AsyncStorage, Platform, StatusBar } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { setTopNavigator } from './services/navigationServices';

import AppRouter from './navigation/AppRouter';
import useLinking from './navigation/useLinking';

const App = ({ navigation, ...props }) => {
	const [barTheme, setBarTheme] = React.useState('light-content')
	const [isLoadingComplete, setLoadingComplete] = React.useState(false);
	const containerRef = React.useRef();
	// Load any resources or data that we need prior to rendering the app
	const loadResourcesAndDataAsync = React.useCallback(async () => {
		try {
			SplashScreen.preventAutoHideAsync();
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
		} catch (e) {
			// We might want to provide this error information to an error reporting service
			console.warn(e);
		} finally {
			setLoadingComplete(true);
			SplashScreen.hideAsync();
		}
	});
	
	React.useEffect(() => {
		loadResourcesAndDataAsync();
	}, []);

	if (!isLoadingComplete && !props.skipLoadingScreen) {
		return null;
	} else {
		return (
			<>
				{Platform.OS === 'ios' && <StatusBar barStyle={barTheme} />}
				<PaperProvider>
					<NavigationContainer ref={containerRef => setTopNavigator(containerRef)}>
						<AppRouter/>
					</NavigationContainer>
				</PaperProvider>
			</>
		);
	}
}

export default App;
