import * as React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet } from 'react-native';

import Colors from '../constants/Colors';

function TabBarIcon(props) {
  return (
    <Ionicons
      name={props.name}
      size={30}
      style={{ marginBottom: -3 }}
      color={props.focused ? Colors.iconSelected : Colors.iconDefault}
    />
  );
}

function InputIcon(props) {
  return (
    <Ionicons
      name={props.name}
      size={props.size}
      style={styles[props.class]}
      color={props.focused ? Colors.iconSelected : Colors.iconDefault}
    />
  );
}

const styles = StyleSheet.create({
  leftIcon: {
    marginLeft: -11, 
    marginRight: 6
  }
});

export { TabBarIcon, InputIcon }