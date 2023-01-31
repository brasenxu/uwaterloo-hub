import React, { useContext } from 'react';
import { Appbar, MD3DarkTheme } from "react-native-paper";
import { DarkTheme, NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import MorePage from "./MorePage";
import SettingsPage from "../Settings/SettingsPage";
import Page from "../../components/Page";
import colors from "../../config/colors";
import sharedStyles from "../../config/sharedStyles";
import MoreAppbar from "./MoreAppbar";
import { Settings } from "../../settings";


function MoreNavigator() {

    const Stack = createStackNavigator();
    const settings = useContext(Settings);
    const CombinedTheme = {
        ...DarkTheme,
        ...MD3DarkTheme,
        colors: {
            ...DarkTheme.colors,
            ...settings.theme.colors
        }
    }

    return (
        <Page>
            <NavigationContainer theme={CombinedTheme}>
                <Stack.Navigator
                    initialRouteName="More"
                    screenOptions={{header: MoreAppbar}}>

                    <Stack.Screen name="More" component={MorePage} />
                    <Stack.Screen name="Settings" component={SettingsPage} />

                </Stack.Navigator>
            </NavigationContainer>
        </Page>
    );
}

export default MoreNavigator;
