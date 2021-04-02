import React, { useContext, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { useFocusEffect, StackActions } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import { Card, Text } from 'react-native-elements';

import { Constants, DarkTheme } from '../constants/Theme';
import { Context as AuthContext } from '../context/AuthContext';
import AuthForm from '../components/AuthForm';
import NavLink from '../components/NavLink';
import Spacer from '../components/Spacer';
import WaveShape from '../components/WaveShape';

const SignupScreen = ({ navigation }) => {
    const { state, signup, clearErrorMessage } = useContext(AuthContext);
   
    useFocusEffect(
        React.useCallback(() => {
            if (state.errorMessage) return clearErrorMessage();
            return;
        }, [])
    );

    useEffect(() => {
        if (state.route && state.route !== 'Auth') {
            navigation.dispatch(
                StackActions.replace('Main', {screen: state.route})
            );
        }
    }, [state.route]);
    
    return (
        <View style={styles.container}>
            <KeyboardAwareScrollView contentContainerStyle={styles.cardContainer}>
                <Text style={styles.header}> Let's Get Started! </Text>
                <Card containerStyle={Constants.boxShadow}>
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
            </KeyboardAwareScrollView>
            <WaveShape style={{ position: "absolute" , bottom: 0, zIndex: 1 }} opacity="0.5" path="pathBottom" view="49 -3.6 650 22" fill="#9966ff" />
            <WaveShape style={{ position: "absolute" , bottom: 0, zIndex: 1 }} opacity="0.6" path="pathBottom" view="50 -3 650 20" fill="#9966ff" />
        </View>
        
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        ...DarkTheme
    },
    header: {
        position: "absolute",
        top: 90,
        fontSize: 30,
        alignSelf: "center",
        color: '#fff',
        marginBottom: 20
    },
    cardContainer: {
        flex: 1,
        alignContent: 'center',
        justifyContent: 'center',
        ...DarkTheme
    }
});

export default SignupScreen;
