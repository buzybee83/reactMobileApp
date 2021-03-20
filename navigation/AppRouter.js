import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { Provider as AuthProvider } from '../context/AuthContext';
import { Provider as BudgetProvider } from '../context/BudgetContext';
import { Provider as ExpenseProvider } from '../context/ExpenseContext';

//IMPORT ROUTES
import AuthLoading from '../screens/AuthLoading';
import AuthStack from './AuthStack';
import IntroStack from './IntroStack';
import HomeStack from './HomeStack';

//APP STACK
const AppStack = createStackNavigator();

export default function AppRouter(props) {
    return (
        <AuthProvider>
            <BudgetProvider>
                <ExpenseProvider>
                    <AppStack.Navigator 
                        headerMode="none"
                        initialRouteName="Loading">
                        <AppStack.Screen
                            name="Loading"
                            component={AuthLoading}
                        />
                        <AppStack.Screen
                            name="Auth"
                            component={AuthStack}
                        />
                        <AppStack.Screen
                            name="Intro"
                            component={IntroStack}
                        />
                        <AppStack.Screen
                            name="Home"
                            component={HomeStack}
                        />                        
                    </AppStack.Navigator>
                </ExpenseProvider>
            </BudgetProvider>
        </AuthProvider>
    );
}