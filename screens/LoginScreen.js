import React, { useContext, useLayoutEffect }  from 'react';
import { View, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Context as AuthContext } from '../context/AuthContext';
import AuthForm from '../components/AuthForm';
import NavLink from '../components/NavLink';
import Spacer from '../components/Spacer';

const LoginScreen = ({ navigation }) => {
    const { state, login, clearErrorMessage, bootstrapAuthAsync } = useContext(AuthContext);
    
    useLayoutEffect(() => {
        console.log('LAYOUTEFFECT CALLED');
        // bootstrapAuthAsync();
    },[]);

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
                headerText="Welcome"
                errorMessage={state.errorMessage}
                submitButtonText="Login"
                onSubmit={login}
            />
            <Spacer size={34}/>
            <NavLink routeName="Signup" text="Don't have an account?" />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24
    }
});

export default LoginScreen;
