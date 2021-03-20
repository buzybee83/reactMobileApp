import React, { useState } from 'react';
import { useForm } from "react-hook-form";

import { Text, Input, Button } from 'react-native-elements';
import { useFocusEffect } from '@react-navigation/native';
import { InputIcon } from '../components/Icons';
import { Constants } from '../constants/Theme';
import Spacer from '../components/Spacer';

const IncomeForm = ({ onSubmitForm }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');

    useFocusEffect(
        React.useCallback(() => {
            return () => {
                setEmail('');
                setPassword('');
                setFirstName('');
                setLastName('');
            };
        }, [])
    );

    return (
        <>
            <Text h4 style={{ textAlign: "center" }}>{headerText}</Text>
            <Spacer size={8} />
            {type == 'Signup' &&
                <>
                    <Input
                        leftIcon={
                            <InputIcon
                                class="leftIcon"
                                name="md-person"
                                size={24}
                            />
                        }
                        placeholder="First Name"
                        value={firstName}
                        onChangeText={setFirstName}
                        autoCorrect={false}
                    />
                    <Spacer size={2} />
                    <Input
                        leftIcon={
                            <InputIcon
                                class="leftIcon"
                                name="md-person"
                                size={24}
                            />
                        }
                        placeholder="Last Name"
                        value={lastName}
                        onChangeText={setLastName}
                        autoCorrect={false}
                    />
                    <Spacer size={2} />
                </>
            }
            <Input
                leftIcon={
                    <InputIcon
                        class="leftIcon"
                        name="md-mail"
                        size={23}
                    />
                }
                placeholder="sample@domain.com"
                value={email}
                onChangeText={setEmail}
                autoCompleteType="email"
                autoCapitalize="none"
                keyboardType="email-address"
                autoCorrect={false}
            />
            <Spacer size={7} />
            <Input
                leftIcon={
                    <InputIcon
                        class="leftIcon"
                        name="md-lock-closed"
                        size={23}
                    />
                }
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                autoCapitalize="none"
                autoCorrect={false}
                clearTextOnFocus={type != 'Signup'}
                secureTextEntry
            />
            <Spacer size={1} />
            <Text style={{ color: Constants.errorText }}>{errorMessage}</Text>
            <Spacer size={8} />
            <Button
                raised
                loading={isLoading}
                onPress={() => callback(!isVisible)}
                title="Save"
                icon={
                    <ButtonIcon  
                        name="md-add" 
                        position="left"
                        size={24} 
                        color={Constants.whiteColor} 
                    />
                }
            />
        </>
    );
}

export default IncomeForm;




