import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import MonthDetailScreen from '../screens/MonthDetailScreen';

const Stack = createStackNavigator();

function BudgetStack({ navigation, route }) {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Budget"
                component={HomeScreen}
                options={{
                    headerTitle: getHeaderTitle(route)
                }}
            />
            <Stack.Screen
                name="MonthDetails"
                component={MonthDetailScreen}
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
    const routeName = route.state?.routes[route.state.index]?.name ?? 'Budget';
    switch (routeName) {
        case 'MonthDetails':
            return `${headerTitle} Details`;
        case 'Budget':
            return "Budget Overview"
    }
}

export { BudgetStack }
