import React from 'react';
import { StyleSheet, View, Switch, Picker } from 'react-native';
import { Text } from 'react-native-elements';
import { TextInputMask } from 'react-native-masked-text'
import RNDateTimePicker from '@react-native-community/datetimepicker';
// TODO: Picker above is deprecated but not yet taken out of React-Native core so the new way below is not supported
// import { Picker } from '@react-native-community/picker';

import { Constants } from '../constants/Theme';

const getRawValue = (formattedVal) => {
  return formattedVal.replace(/[$,]/g, '');
}

const FieldTemplate = ({ item, action, childIndex }) => {
  switch (item.type) {
    case 'switch':
      return (
        <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
          <Text style={[styles.label, styles.labelCenter]}> {item.label} </Text>
          <Switch
            value={item.value}
            trackColor={{ false: '#646464', true: '#4A148C' }}
            onValueChange={(value) => {
              item.value = value;
              action(value);
            }}
          />
        </View>
      );
    case 'currency':
      return (
        <View
          style={{ alignItems: 'center' }}
        >
          <Text style={[styles.label, { marginBottom: 16 }]}> {item.label} </Text>
          <TextInputMask
            style={styles.maskedInputStyle}
            type={'money'}
            value={item.value}
            options={{
              separator: '.',
              delimiter: ',',
              unit: '$',
              suffixUnit: ''
            }}
            onChangeText={(value) => {
              item.value = value;
              action(getRawValue(value));
            }}
          />
        </View>
      );
    case 'date':
      return (
        <>
          <Text style={[styles.label, styles.labelCenter]}> {item.label} </Text>
          <RNDateTimePicker
            testID="dateTimePicker"
            textColor="white"
            timeZoneOffsetInMinutes={0}
            value={item.value ? item.value : new Date}
            minimumDate={new Date()}
            mode="date"
            display="spinner"
            onChange={(event, selectedDate) => {
              item.value = selectedDate;
              action(selectedDate);
            }}
          />
        </>
      );
    case 'select':
      return (
        <>
          <Text style={[styles.label, styles.labelCenter]}> {item.label} </Text>
          <Picker
            style={styles.picker}
            itemStyle={styles.pickerItem}
            testID={item.field}
            selectedValue={item.value}
            onValueChange={(itemValue) => {
              item.value = itemValue;
              if (childIndex !== undefined) action(itemValue, childIndex);
              else action(itemValue);
            }}
          >
            {item.initOptions ?
              Object.keys(item.initOptions).map((key) => {
                return <Picker.Item key={key} label={item.initOptions[key]} value={key} />;
              }) :
              Object.keys(item.options).map((key) => {
                return <Picker.Item key={key} label={item.options[key]} value={key} />;
              })
            }
          </Picker>
        </>
      );
    case 'number':
      return (
        <View
          style={{ alignItems: 'center' }}
        >
          <Text style={[styles.label, { marginBottom: 16 }]}> {item.label} </Text>
          <TextInputMask
            style={styles.maskedInputStyle}
            value={item.value}
            type={'only-numbers'}
            options={{
              unit: '',
              separator: '.',
              delimiter: ',',
              suffixUnit: ''
            }}
            onChangeText={(value) => {
              item.value = value;
              if (childIndex !== undefined) action(getRawValue(value), childIndex);
              else action(getRawValue(value));
            }}
          />
        </View>
      );
    default:
      return <></>
  }
};

export default class InitialFlowForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      item: this.props.data,
      action: this.props.action
    };
  }

  render() {
    return (
      <>
        {this.state.item.children ?
          this.state.item.children.map((child, index) => {
            return (
              <FieldTemplate
                key={index}
                item={child}
                childIndex={index}
                action={this.state.action}
              />
            )
          }) :
          <FieldTemplate
            item={this.state.item}
            action={this.state.action}
          />
        }
      </>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  label: {
    color: '#fff',
    fontSize: Constants.fontMedium,
    marginTop: 4
  },
  labelCenter: {
    alignSelf: 'center'
  },
  picker: {
    color: '#fff'
  },
  pickerItem: {
    color: '#fff',
    height: 115
  },
  maskedInputStyle: {
    width: '55%',
    fontSize: 20,
    height: 40,
    padding: 6,
    textAlign: 'center',
    backgroundColor: '#fff',
    borderRadius: 2
  },
});


