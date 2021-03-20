import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ExpensesScreen from '../screens/ExpensesScreen';
import ExpenseDetailScreen from '../screens/ExpenseDetailScreen';

const Stack = createStackNavigator();

function ExpenseStack({ route }) {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Expenses"
                component={ExpensesScreen}
                options={{
                    headerTitle: 'Monthly Expenses'
                }}
            />
            <Stack.Screen
                name="ExpenseDetails"
                component={ExpenseDetailScreen}
                options={{
                    headerBackTitle: '',
                    headerTitle: getHeaderTitle(route)
                }}
            />
        </Stack.Navigator>
    );
}

function getHeaderTitle(route) {
    const headerTitle = route.state?.routes[route.state.index]?.params?.headerTitle;
    return `${headerTitle} Details`;
}

export { ExpenseStack }
