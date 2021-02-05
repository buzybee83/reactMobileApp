import React, { useEffect } from 'react';
import { StyleSheet, AsyncStorage } from 'react-native';
import { Card } from 'react-native-elements';
import { useHeaderHeight } from '@react-navigation/stack';

import Spacer from '../components/Spacer';
import WaveShape from '../components/WaveShape';

const ExpensesScreen = ({ navigation }) => {
    const headerHeight = useHeaderHeight();
    useEffect(() => {
		async function loadExpenses() {
			try {
				let currentUser = await AsyncStorage.getItem('currentUser');
				if (currentUser) {
					currentUser = JSON.parse(currentUser);
					
				}
			} catch (e) {
				// We might want to provide this error information to an error reporting service
				console.warn(e);
			} finally {
				setLoadingComplete(true);
			}
		}

		loadExpenses();
    }, []);
    
    return (
        
            <Card containerStyle={Constants.boxShadow}>
                
                <Spacer size={34} />
                <NavLink routeName="Signup" text="Don't have an account?" />
            </Card> 
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignContent: 'center',
        justifyContent: 'center',
        backgroundColor: DarkTheme.darkBackground
    },
    header: {
        position: "absolute",
        top: 130,
        fontSize: 30,
        alignSelf: "center",
        color: '#fff',
        marginBottom: 20
    }
});

export default ExpensesScreen;
