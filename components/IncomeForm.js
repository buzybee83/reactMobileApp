import React, { useState } from 'react';
import {
    View,
    StyleSheet, 
    TouchableWithoutFeedback, 
    Keyboard, 
    TouchableOpacity,
    AsyncStorage
} from 'react-native';
import { Picker } from '@react-native-community/picker'
import { useForm, Controller } from "react-hook-form";
import { Text } from 'react-native-elements';
import { TextInput, Button, ToggleButton } from 'react-native-paper';
import { Constants } from '../constants/Theme';
import Spacer from '../components/Spacer';
import { constructDaysInMonth, nth, IncomeType } from '../services/utilHelper';

const IncomeForm = ({ onSubmitForm, onDelete, item, settings }) => {
    const { control, handleSubmit, formState, errors } = useForm({
        mode: 'onChange',
    });
    const daysInMonth = constructDaysInMonth();
    const { isDirty, isSubmitted, isValidating } = formState;
    
    const onSubmit = (data) => {
        if (isDirty && !Object.keys(errors).length) {
            if (item && item.incomeType == 1 && item.status == 'original') {
                if (!propagationOptions[propagationSelection]) {
                    return;
                }
                item.isAutomated = propagationOptions[propagationSelection]?.value;
            } 
            if (!data.incomeType) data.isAutomated = false;
            
            onSubmitForm(data, item);
        }
    };

    const [propagationSelection, setPropagationSelection] = useState(null);

    const propagationOptions = [
        { label: "Yes", value: true },
        { label: "No", value: false },
    ];

    const onSelect = (idx) => {
        setPropagationSelection(idx);
    }

    const ButtonGroup = () => {
        return (
            <View style={{ flexDirection: 'row', alignContent: 'stretch' }}>
                {propagationOptions.map((option, index) => {
                    const selectedLabelStyle = propagationSelection == index && styles.selectedLabelStyle;
                    const selectedBtnStyle = propagationSelection == index && styles.selectedBtnGroup
                    return (
                        <View style={[styles.btnGroup, selectedBtnStyle]} key={index}>
                            <TouchableWithoutFeedback onPress={() => onSelect(index)}>
                                <Text style={[styles.formLabel, selectedLabelStyle, { textAlign: 'center' }]}>{option.label}</Text>
                            </TouchableWithoutFeedback>
                        </View>
                    )
                })}
            </View>
        );
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={styles.formContainer}>
                <View>
                    <Spacer size={1} />
                    {item &&
                        <View style={{ paddingBottom: 20 }}>
                            <Button>{IncomeType[item.incomeType]}</Button>
                        </View>
                    }
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
                        name="description"
                        rules={{ required: true }}
                        defaultValue={item ? item.description : ""}
                    />
                    {errors.description && <Text style={styles.hasError}>This is required.</Text>}
                    {!errors.description && <Spacer size={1} />}
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
                        defaultValue={item ? item.amount.toFixed(2).toString() : ""}
                    />
                    {errors.amount && errors.amount.type == 'required' &&
                        <Text style={styles.hasError}>This is required.</Text>
                    }
                    {errors.amount && errors.amount.type == 'pattern' && !isValidating &&
                        <Text style={styles.hasError}>Must be a valid number and up to 2 decimal places.</Text>
                    }
                    
                    {!item &&
                        <View style={styles.fieldContainer}>
                            <View style={{ flex: 2, justifyContent: 'flex-end', paddingBottom: 4 }}>
                                <Text style={styles.formLabel}>Type of Income </Text>
                            </View>
                            <Controller
                                control={control}
                                render={({ onChange, value }) => (
                                    <Picker
                                        value={value}
                                        type="outlined"
                                        style={styles.pickerContainer}
                                        itemStyle={styles.pickerItem}
                                        selectedValue={value.toString()}
                                        onValueChange={value => onChange(value ? parseInt(value) : "")}
                                        value={value}
                                    >
                                        <Picker.Item label="Paycheck/Recurring" value="1" />
                                        <Picker.Item label="Misc/One time" value="0" />
                                    </Picker>
                                )}
                                name="incomeType"
                                defaultValue={item ? item.incomeType : "1"}
                            />
                        </View>
                    }
                    <View style={[styles.fieldContainer, { paddingTop: 30 }]}>
                        <View style={{ flexDirection: 'row', flex: 2 }}>
                            <Text style={[styles.formLabel, { marginTop: 32 }]}>Day Expected</Text>
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
                                                label={daysInMonth[key] + (nth(daysInMonth[key]))}
                                                value={daysInMonth[key]}
                                            />
                                        )
                                    })}
                                </Picker>
                            )}
                            rules={{ required: true }}
                            name="payday"
                            defaultValue={item ? item.payday : ""}
                        />
                    </View>
                    {errors.payday && <Text style={styles.hasError}>This is required.</Text>}
                </View>
                {item && item.incomeType == 1 && item.status == 'modified' && isDirty &&
                    <Text>Note: This Income was previously modified. The new changes will not be applied to future months.</Text>
                }
                {item && item.incomeType == 1 && item.status == 'original' && isDirty &&
                    <View style={{ flexDirection: 'column' }}>
                        <Text style={styles.formLabel}> Apply these changes to following months' income? </Text>
                        <ButtonGroup/>
                        {isDirty && isSubmitted && !propagationOptions[propagationSelection] &&
                            <Text style={styles.hasError}>This is required.</Text>
                        }
                    </View>
                }
                <View style={{ paddingTop: 20 }}>
                    <Text style={styles.warningText}>
                        {isSubmitted && !isDirty && !Object.keys(errors).length ? 'No change detected.' :
                            (isSubmitted && Object.keys(errors).length && !isValidating ? 'Please fix fields with errors.' : '')
                        }
                    </Text>

                    <Button
                        mode="contained"
                        dark
                        style={styles.primaryBtn}
                        onPress={handleSubmit(onSubmit)}
                    >
                        {item ? 'Update' : 'Save'}
                    </Button>
                    {onDelete && item &&
                        <Button
                            style={{ marginTop: 6 }}
                            color={Constants.errorText}
                            mode="outlined"
                            onPress={() => onDelete(item._id)}
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
        flex: 3,
        height: 60,
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
    btnGroup: {
        borderColor: Constants.tintColor,
        borderWidth: 1,
        backgroundColor: 'white',
        flex: 2,
        padding: 8,
        marginTop: 16,
        marginBottom: 6
    },
    selectedBtnGroup: {
        backgroundColor: Constants.tintColor
    },
    selectedLabelStyle: {
        color: 'white',
        fontWeight: Constants.fontWeightMedium
    },
    primaryBtn: {
        backgroundColor: Constants.tintColor
    },
    deleteBtn: {
        color: Constants.errorText
    }
});

export default IncomeForm;

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



