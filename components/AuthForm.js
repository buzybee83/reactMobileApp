import React, { useState } from 'react';
import { Text, Input, Button } from 'react-native-elements';
import { InputIcon } from '../components/Icons';
import Colors from '../constants/Colors';
import Spacer from '../components/Spacer';

function AuthForm({ headerText, errorMessage, submitButtonText, onSubmit }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    return (
        <>
            <Text h4 style={{ textAlign: "center" }}>{headerText}</Text>
            <Spacer size={8}/>
            <Input
                leftIcon={
                    <InputIcon
                        class="leftIcon"
                        name="md-mail"
                        size={24}
                    />
                }
                placeholder="sample@domain.com"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                autoCorrect={false}
                autoFocus={true}
            />
            <Spacer size={7}/>
            <Input
                leftIcon={
                    <InputIcon
                        class="leftIcon"
                        name="md-lock"
                        size={28}
                    />
                }
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                autoCapitalize="none"
                autoCorrect={false}
                secureTextEntry
            />
            <Spacer size={1}/>
            <Text style={{color: Colors.errorText}}>{errorMessage}</Text>
            <Spacer size={8} />   
            <Button title={submitButtonText} onPress={() => onSubmit({ email, password })} />
        </>
    );
}

export default AuthForm;
