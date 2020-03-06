import React, { useContext } from 'react';
import { Platform, StyleSheet, KeyboardAvoidingView, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
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
        <KeyboardAwareScrollView contentContainerStyle={styles.container}>
            <View style={styles.card}>
                <Card>
                    <AuthForm
                        type="Signup"
                        headerText="Creat a Free Account"
                        errorMessage={state.errorMessage}
                        submitButtonText="Signup"
                        onSubmit={signup}
                    />
                    <Spacer size={34} />
                    <NavLink routeName="Login" text="Already have an account?" />
                </Card>
            </View>
        </KeyboardAwareScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    card: {
        flex: 1,
        alignContent: 'center',
        justifyContent: 'center'
    }
});

export default SignupScreen;
