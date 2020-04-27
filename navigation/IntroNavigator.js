import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import IntroScreen from '../screens/IntroScreen';

const IntroStack = createStackNavigator();

export default function IntroNavigator({ navigation, route }) {
  return (
    <IntroStack.Navigator 
        headerMode="none"
        initialRouteName="Intro">
      <IntroStack.Screen
        name="Intro"
        options={{
            headerLeft: null
        }}
        component={IntroScreen}
      />
    </IntroStack.Navigator>
  );
}

IntroStack.navigationOptions = {
  header: null,
}

