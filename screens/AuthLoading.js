import React, { useEffect, useContext} from 'react';
import { CommonActions } from '@react-navigation/native';
import { View, Text} from 'react-native';
import { ActivityIndicator } from 'react-native-paper';

import { Context as AuthContext } from '../context/AuthContext';
import { Constants } from '../constants/Theme';

export default function AuthLoading({ navigation }) {
    const { state, bootstrapAuthAsync, logout } = useContext(AuthContext);

    useEffect(() => {
        initialize()
    }, [state.homeScreen]);

    async function initialize() {
        try {
            await bootstrapAuthAsync();
            if (state.homeScreen) {
                navigation.dispatch(
                    CommonActions.navigate({name: state.homeScreen})
                );
            }
        } catch (e) {
            logout();
        }
    }

    return (
        <View style={{backgroundColor: Constants.darkGrey, alignItems: 'center', justifyContent: 'center', flex: 1}}>
            <ActivityIndicator color={Constants.whiteColor}/>
            <Text style={{color: Constants.whiteColor}}>{"Loading..."}</Text>
        </View>
    );
};