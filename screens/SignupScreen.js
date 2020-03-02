import React, { useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
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
        <View style={styles.container} >
            <AuthForm
                headerText="Creat a Free Account"
                errorMessage={state.errorMessage}
                submitButtonText="Signup"
                onSubmit={signup}
            />
            <Spacer size={34}/>
            <NavLink routeName="Login" text="Already have an account?" />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24
    }
});

export default SignupScreen;
