import React, { useContext } from "react";
import { Appbar } from "react-native-paper";
import sharedStyles from "../../config/sharedStyles";
import { Settings } from "../../settings";


function MoreAppbar({ back, navigation, route }) {

    const settings = useContext(Settings);

    return (

        <Appbar.Header style={{ backgroundColor: settings.theme.colors.background }}>
            {back ? <Appbar.BackAction onPress={navigation.goBack} /> : null}
            <Appbar.Content title={route.name} titleStyle={{ fontWeight: sharedStyles.bold }}/>
        </Appbar.Header>

    )

}


export default MoreAppbar;
