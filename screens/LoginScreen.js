import React, { useContext } from 'react';
import { StyleSheet, Text, KeyboardAvoidingView, Platform } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Card } from 'react-native-elements';
import { useHeaderHeight } from '@react-navigation/stack';

import { Constants, DarkTheme } from '../constants/Theme';
import { Context as AuthContext } from '../context/AuthContext';
import AuthForm from '../components/AuthForm';
import NavLink from '../components/NavLink';
import Spacer from '../components/Spacer';
import WaveShape from '../components/WaveShape';

const LoginScreen = ({ navigation }) => {
    const { state, login, clearErrorMessage } = useContext(AuthContext);
    const headerHeight = useHeaderHeight();

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
            contentContainerStyle={{flex: 1}}
            keyboardVerticalOffset={-headerHeight - 25}
            behavior={Platform.OS == 'ios'? "padding" : "height"}>
            <WaveShape style={{ position: "absolute" , bottom: 0, zIndex: 1 }} opacity="0.55" path="pathTop" view="-1 1 350 750" fill="#9966ff" />
            <Text style={styles.header}> WELCOME </Text>
            <Card containerStyle={Constants.boxShadow}>
                <AuthForm
                    headerText=""
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
        backgroundColor: DarkTheme.darkBackground
    },
    header: {
        position: "absolute",
        top: 130,
        fontSize: 30,
        alignSelf: "center",
        color: '#fff',
        marginBottom: 20
    }
});

export default LoginScreen;
