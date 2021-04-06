import React, { useState } from 'react';
import { View, StyleSheet, TouchableWithoutFeedback, Keyboard, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-community/picker'
import { useForm, Controller } from "react-hook-form";
import { Text } from 'react-native-elements';
import { TextInput, Switch, Button } from 'react-native-paper';
import { Constants } from '../constants/Theme';
import Spacer from '../components/Spacer';
import { constructDaysInMonth, nth } from '../services/utilHelper';

const ExpenseForm = ({ onSubmitForm, onDelete, expense }) => {
    const { control, handleSubmit, formState, errors, reset } = useForm({
        mode: 'onChange',
    });
    const [canShowRecurringType, setCanShowRecurringType] = useState((expense ? expense.frequency.isRecurring : true));
    const daysInMonth = constructDaysInMonth();
    // const [expense, setexpense] = expense._id ? useState(expense) : useState({});
    const { isDirty, isSubmitted, isTouched, isValid, isValidating } = formState;
    const onSubmit = (data) => {
        if (isDirty && isValid) {
            onSubmitForm(data, expense);
        }
    };
    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={styles.formContainer}>
                <View>
                    <Spacer size={1} />
                    <Controller
                        control={control}
                        render={({ onChange, value, ref }) => (
                            <TextInput
                                label="Description"
                                mode="outlined"
                                inputRef={ref}
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
                        render={({ onChange, value, ref }) => (
                            <TextInput
                                label="Amount"
                                mode="outlined"
                                keyboardType="numeric"
                                inputRef={ref}
                                onChangeText={value => onChange(value)}
                                value={value}
                            />
                        )}
                        rules={{ required: true, pattern: /^[0-9]+(\.\d{1,2})?$/ }}
                        name="amount"
                        defaultValue={expense ? expense.amount.toFixed(2).toString() : ""}
                    />
                    {errors.amount && errors.amount.type == 'required' &&
                        <Text style={styles.hasError}>This is required.</Text>
                    }
                    {errors.amount && errors.amount.type == 'pattern' && !isValidating &&
                        <Text style={styles.hasError}>Must be a valid number and up to 2 decimal places.</Text>
                    }
                    <View style={styles.fieldContainer}>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={[styles.formLabel, { marginTop: 32 }]}> Due Day </Text>
                        </View>
                        <Controller
                            control={control}
                            render={({ onChange, value, ref }) => (
                                <Picker
                                    value={value}
                                    type="outlined"
                                    itemStyle={styles.pickerItem}
                                    style={styles.pickerContainer}
                                    selectedValue={value.toString()}
                                    onValueChange={value => onChange(value ? parseInt(value) : "")}
                                    value={value}
                                >
                                    <Picker.Item label="Select day..." value="" />
                                    {Object.keys(daysInMonth).map((key) => {
                                        return (
                                            <Picker.Item 
                                                key={key + 1} 
                                                label={daysInMonth[key]+(nth(daysInMonth[key]))} 
                                                value={daysInMonth[key]} 
                                            />
                                        )
                                    })}
                                </Picker>
                            )}
                            rules={{ required: true }}
                            name="dueDay"
                            defaultValue={expense ? expense.dueDay : ""}
                        />
                    </View>
                    {errors.dueDay && <Text style={styles.hasError}>This is required.</Text>}
                    <View style={[styles.fieldContainer, { paddingTop: 40 }]}>
                        <Text style={[styles.formLabel, { flex: 2 }]}>Split between paychecks </Text>
                        <Controller
                            control={control}
                            render={({ onChange, value }) => (
                                <Switch
                                    containerStyle={{ flex: 2 }}
                                    style={{ marginRight: '2%' }}
                                    value={value}
                                    color={Constants.tintColor}
                                    mode="outlined"
                                    onValueChange={value => onChange(value)}
                                />
                            )}
                            name="split"
                            defaultValue={expense ? expense.split : false}
                        />
                    </View>
                    <View style={[styles.fieldContainer, { paddingTop: 30 }]}>
                        <Text style={[styles.formLabel, { flex: 2 }]}> Recurring Expense </Text>
                        <Controller
                            control={control}
                            render={({ onChange, value }) => (
                                <Switch
                                    containerStyle={{ flex: 2, paddingRight: 24 }}
                                    style={{ marginRight: '2%' }}
                                    value={value}
                                    color={Constants.tintColor}
                                    mode="outlined"
                                    onValueChange={value => {
                                        setCanShowRecurringType(value)
                                        onChange(value)
                                    }}
                                />
                            )}
                            name="isRecurring"
                            defaultValue={expense ? expense.frequency.isRecurring : true}
                        />
                    </View>
                    {canShowRecurringType &&
                        <View style={styles.fieldContainer}>
                            <View style={{ flex: 2 }}>
                                <Text style={[styles.formLabel, { marginTop: 32 }]}> Select Frequency </Text>
                            </View>
                            <Controller
                                control={control}
                                render={({ onChange, value }) => (
                                    <Picker
                                        value={value}
                                        type="outlined"
                                        style={[styles.pickerContainer]}
                                        itemStyle={styles.pickerItem}
                                        selectedValue={value}
                                        onValueChange={value => onChange(value)}
                                        value={value}
                                    >
                                        <Picker.Item label="Weekly" value="Weekly" />
                                        <Picker.Item label="Twice a Month" value="Twice a Month" />
                                        <Picker.Item label="Once a Month" value="Once a Month" />
                                        <Picker.Item label="Every Other Month" value="Every Other Month" />
                                    </Picker>
                                )}
                                name="recurringType"
                                defaultValue={expense ? expense.frequency.recurringType : "Once a Month"}
                            />
                        </View>
                    }
                </View>
                <View style={{ paddingTop: 20 }}>
                    <Text style={styles.warningText}>
                        {isSubmitted && (!isDirty && !isTouched) && !Object.keys(errors).length ? 'No change detected.' :
                            (isSubmitted && Object.keys(errors).length && !isValidating ? 'Please fix fields with errors.' : '')
                        }
                    </Text>

                    <Button
                        mode="contained"
                        dark
                        style={styles.primaryBtn}
                        onPress={handleSubmit(onSubmit)}
                    >
                        {expense ? 'Update' : 'Save'}
                    </Button>
                    {onDelete && expense &&
                        <Button
                            style={{ marginTop: 6 }}
                            color={Constants.errorText}
                            mode="outlined"
                            onPress={() => onDelete(expense._id)}
                            TouchableComponent={TouchableOpacity}
                        >
                            Delete
                        </Button>
                    }
                </View>
            </View>

        </TouchableWithoutFeedback>
    );
}
const styles = StyleSheet.create({
    formContainer: {
        flex: 1,
        justifyContent: 'space-between',
        paddingBottom: 50
    },
    pickerContainer: {
        height: 60,
        width: '55%',
    },
    pickerItem: {
        height: 94
    },
    formLabel: {
        fontSize: Constants.fontMedium,
        color: Constants.darkGrey
    },
    fieldContainer: {
        display: 'flex',
        paddingTop: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    hasError: {
        fontSize: Constants.fontSmall,
        color: Constants.errorText,
        marginVertical: 8
    },
    warningText: {
        fontSize: Constants.fontSmall,
        color: Constants.errorText,
        paddingVertical: 6
    },
    primaryBtn: {
        backgroundColor: Constants.tintColor
    },
    deleteBtn: {
        color: Constants.errorText
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



