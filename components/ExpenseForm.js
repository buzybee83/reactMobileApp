import React, { useState } from 'react';
import { View, StyleSheet, Picker, TouchableWithoutFeedback, Keyboard, TouchableOpacity } from 'react-native';
import { useForm, Controller } from "react-hook-form";
import { Text, Button } from 'react-native-elements';
import { TextInput, Switch } from 'react-native-paper';
import { InputIcon } from '../components/Icons';
import { Constants } from '../constants/Theme';
import Spacer from '../components/Spacer';

const constructDaysInMonth = () => {
    const days = [];
    let num = 1;
    while (days.length < 31) {
        days.push(num.toString());
        num++;
    }
    return days;
}

const ExpenseForm = ({ onSubmitForm, expense}) => {
    const { control, handleSubmit, errors } = useForm();
    const daysInMonth = constructDaysInMonth();

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View>
                <Spacer size={1} />
                <Controller
                    control={control}
                    render={({ onChange, onBlur, value }) => (
                        <TextInput
                            label="Name of Expense"
                            mode="outlined"
                            onBlur={() => onBlur(Keyboard.dismiss())}
                            onChangeText={value => onChange(value)}
                            value={value}
                        />
                    )}
                    name="name"
                    rules={{ required: true }}
                    defaultValue={expense ? expense.name : ""}
                />
                {errors.name && <Text style={styles.hasError}>This is required.</Text>}
                {!errors.name && <Spacer size={1} />}
                <Controller
                    control={control}
                    render={({ onChange, onBlur, value, ref }) => (
                        <TextInput
                            label="Amount"
                            mode="outlined"
                            keyboardType="numeric"
                            onBlur={onBlur}
                            inputRef={ref}
                            onChangeText={value => onChange(value)}
                            value={value}
                        />
                    )}
                    rules={{ required: true }}
                    name="amount"
                    defaultValue={expense ? expense.amount : ""}
                />
                {errors.amount && errors.amount.type == 'required' && <Text style={styles.hasError}>This is required.</Text>}
                <View style={styles.fieldContainer}>
                    <View style={{width: '40%', flexDirection: 'row'}}>
                        <Text style={[styles.formLabel, {marginTop: 35}]}> Due Day </Text>
                    </View>
                    <Controller
                        control={control}
                        render={({ onChange, onBlur, value, ref }) => (
                            <Picker
                                value={value}
                                type="outlined"
                                onBlur={onBlur}
                                itemStyle={styles.pickerItem}
                                style={styles.pickerContainer}
                                selectedValue={value.toString()}
                                onValueChange={value => onChange(parseInt(value))}
                                value={value}
                            >
                                <Picker.Item label="Select day..." value="" />
                                {Object.keys(daysInMonth).map((key) => {
                                    return <Picker.Item key={key+1} label={daysInMonth[key]} value={daysInMonth[key]} />;
                                })}
                            </Picker>
                        )}
                        rules={{ required: true }}
                        name="dueDay"
                        defaultValue={expense ? expense.dueDay : ""}
                    />
                </View>
                {errors.dueDay && <Text style={styles.hasError}>This is required.</Text>}
                <View style={[styles.fieldContainer, {paddingTop: 40}]}>
                    <Text style={styles.formLabel}> Recurring Expense </Text>
                    <Controller
                        control={control}
                        render={({ onChange, onBlur, value }) => (
                            <Switch
                                style={{ marginRight: '40%' }}
                                value={value}
                                color={Constants.tintColor}
                                mode="outlined"
                                onBlur={onBlur}
                                onValueChange={value => onChange(value)}
                            />
                        )}
                        name="isRecurring"
                        defaultValue={expense ? expense.frequency.isRecurring : true }
                    />
                </View>
                <Spacer size={1} />
                <View style={styles.fieldContainer}>
                    <View style={{width: '40%', flexDirection: 'row'}}>
                        <Text style={[styles.formLabel, {marginTop: 32}]}> Select Frequency </Text>
                    </View>
                    <Controller
                        control={control}
                        render={({ onChange, onBlur, value }) => (
                            <Picker
                                value={value}
                                type="outlined"
                                onBlur={onBlur}
                                style={styles.pickerContainer}
                                itemStyle={styles.pickerItem}
                                selectedValue={value.toString()}
                                onValueChange={value => onChange(value)}
                                value={value}
                            >
                                <Picker.Item label="Weekly" value="1" />
                                <Picker.Item label="Twice a Month" value="2" />
                                <Picker.Item label="Once a Month" value="3" />
                                <Picker.Item label="Every Other Month" value="4" />
                            </Picker>
                        )}
                        name="recurringType"
                        defaultValue={expense ? expense.frequency.recurringType.toString() : "3" }
                    />
                </View>
                <View style={{paddingTop: 60}}>
                    <Button
                        raised
                        buttonStyle={styles.primaryBtn}
                        onPress={handleSubmit(onSubmitForm)}
                        title="Save"
                        TouchableComponent={TouchableOpacity}
                    />
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
}
const styles = StyleSheet.create({
    pickerContainer: {
        height: 45, 
        width: '55%',
    },
    pickerItem: {
        height: 96
    },
    formLabel: {
        fontSize: Constants.fontMedium,
        color: Constants.darkGrey
    },
    fieldContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    hasError: {
        fontSize: Constants.fontSmall,
        color: Constants.errorText,
        marginVertical: 8
    },
    primaryBtn: {
        backgroundColor: Constants.tintColor
    }
});

export default ExpenseForm;

// budgetId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Budget',
//     required: true
// },
// monthtId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Month',
//     required: true
// },
// name: {
//     type: String,
//     required: true,
// },
// dueDay: {
//     type: Number,
//     required: true
// },
// amount: {
//     type: Number,
//     required: true,
// },
// paycheckTag: String,
// frequency: {
//     isRecurring: {
//         type: Boolean,
//         default: true
//     },
//     recurringType: {
//         type: Number,
//         default: 1
//     }
// },
// status: {
//     type: String,
//     default: 'A'
// },
// isPaid: {
//     type: Boolean,
//     default: false
// },
// split: {
//     type: Boolean,
//     default: false
// }



