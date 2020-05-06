import React, { useContext } from 'react';
import { StyleSheet, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import { Card } from 'react-native-elements';

import { Constants, DarkTheme } from '../constants/Theme';
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
        <View style={styles.container}>
            <KeyboardAwareScrollView contentContainerStyle={styles.cardContainer}>
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
        </View>

    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: DarkTheme.darkBackground
    },
    cardContainer: {
        alignContent: 'center',
        justifyContent: 'center',
        backgroundColor: DarkTheme.darkBackground
    }
});

export default SignupScreen;
