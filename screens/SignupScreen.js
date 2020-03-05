import React, { useContext } from 'react';
import { StyleSheet, KeyboardAvoidingView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Card } from 'react-native-elements';
import { Context as AuthContext } from '../context/AuthContext';
import AuthForm from '../components/AuthForm';
import NavLink from '../components/NavLink';
import Spacer from '../components/Spacer';

const SignupScreen = ({ navigation }) => {
    const { state, signup, clearErrorMessage } = useContext(AuthContext);

    useFocusEffect(
        React.useCallback(() => {

            return () => {
                clearErrorMessage();
            };
        }, [])
    );

    return (
        <KeyboardAvoidingView style={styles.container} behavior="padding">
            <Card>
                <AuthForm
                    headerText="Creat a Free Account"
                    errorMessage={state.errorMessage}
                    submitButtonText="Signup"
                    onSubmit={signup}
                />
                <Spacer size={34} />
                <NavLink routeName="Login" text="Already have an account?" />
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

export default SignupScreen;
