import React from 'react';
import { Text, Button } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';

function NavLink({ navigation, routeName, text }) {
    navigation = useNavigation();
    return (
        <>
            <Text style={{ textAlign: "center"}}>{text}</Text>
            <Button
                type="clear"
                title={routeName} 
                onPress={() => navigation.navigate(routeName)}
            />
        </>
    )
}

export default NavLink;