import React from 'react';
import { Text, Button } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { Constants } from '../constants/Theme';

function NavLink({ navigation, routeName, text }) {
    navigation = useNavigation();
    return (
        <>
            <Text style={{ textAlign: "center"}}>{text}</Text>
            <Button
                titleStyle={Constants.buttonLinkDesign}
                type="clear"
                title={routeName} 
                onPress={() => navigation.navigate(routeName)}
            />
        </>
    )
}

export default NavLink;