import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import MonthDetailScreen from '../screens/MonthDetailScreen';

const BudgetStack = createStackNavigator();

function BudgetNavigator({ navigation, route }) {
    return (
        <BudgetStack.Navigator>
            <BudgetStack.Screen
                name="Budget"
                component={HomeScreen}
                options={{
                    headerTitle: getHeaderTitle(route)
                }}
            />
            <BudgetStack.Screen
                name="MonthDetails"
                component={MonthDetailScreen}
                options={{
                    headerBackTitle: '',
                    headerTitle: getHeaderTitle(route)
                }}
            />
        </BudgetStack.Navigator>
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

export { BudgetNavigator }
