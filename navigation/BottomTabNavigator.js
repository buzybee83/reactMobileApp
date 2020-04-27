import React, { useContext } from 'react';
import { StatusBar } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { TabBarIcon } from '../components/Icons';
import HomeScreen from '../screens/HomeScreen';
import IntroScreen from '../screens/IntroScreen';
// import BillsScreen from '../screens/BillsScreen';
import AccountScreen from '../screens/AccountScreen';
import { Context as AuthContext } from '../context/AuthContext';

const BottomTab = createBottomTabNavigator();
const INITIAL_ROUTE_NAME = 'Home';

export default function BottomTabNavigator({ navigation, route }) {
  // Set the header title on the parent stack navigator depending on the
  // currently active tab. Learn more in the documentation:
  // https://reactnavigation.org/docs/en/screen-options-resolution.html
  navigation.setOptions({ headerTitle: getHeaderTitle(route), statusBarStyle: 'light-content' });
  const { state } = useContext(AuthContext);
  console.log('state==', state)
  return (
    <BottomTab.Navigator initialRouteName={INITIAL_ROUTE_NAME}>
      <BottomTab.Screen
        name="Start"
        component={IntroScreen}
        options={{
          title: 'Get Started',
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-medkit" />,
        }}
      />
      <BottomTab.Screen
        name="Home"
        component={HomeScreen}
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

function getHeaderTitle(route) {
  const routeName = route.state?.routes[route.state.index]?.name ?? INITIAL_ROUTE_NAME;
  const currentMonth = new Date().toLocaleString('default', { month: 'long' });

  switch (routeName) {
    case 'Home':
      return `${currentMonth} Overview`;
    case 'Bills':
      return `${currentMonth} Bills`;
    case 'Account':
      return 'My Account';
  }
}
