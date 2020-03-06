import React, { useContext } from 'react';
import { StyleSheet, KeyboardAvoidingView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Card } from 'react-native-elements';
import { Context as AuthContext } from '../context/AuthContext';
import AuthForm from '../components/AuthForm';
import NavLink from '../components/NavLink';
import Spacer from '../components/Spacer';

const LoginScreen = ({ navigation }) => {
    const { state, login, clearErrorMessage } = useContext(AuthContext);

    useFocusEffect(
        React.useCallback(() => {
            return () => {
                clearErrorMessage();
            };
        }, [])
    );

    return (
        <KeyboardAvoidingView 
            style={styles.container} 
            behavior={Platform.OS == 'ios'? "padding" : "height"}>
            <Card>
                <AuthForm
                    headerText="Welcome"
                    errorMessage={state.errorMessage}
                    submitButtonText="Login"
                    onSubmit={login}
                />
                <Spacer size={34} />
                <NavLink routeName="Signup" text="Don't have an account?" />
            </Card> 
        </KeyboardAvoidingView>

    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignContent: 'center',
        justifyContent: 'center',
    }
});

export default LoginScreen;
