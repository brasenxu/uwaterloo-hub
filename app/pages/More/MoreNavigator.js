import React from 'react';
import { Appbar, MD3DarkTheme } from "react-native-paper";
import { DarkTheme, NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import MorePage from "./MorePage";
import SettingsPage from "../Settings/SettingsPage";
import Page from "../../components/Page";
import colors from "../../config/colors";
import sharedStyles from "../../config/sharedStyles";


const Stack = createStackNavigator();
const CombinedTheme = {
    ...DarkTheme,
    ...MD3DarkTheme,
    colors: {
        ...DarkTheme.colors,
        ...colors
    }
}

function HeaderBar() {

    return (
        <Appbar.Header>
            <Appbar.Content title="More" titleStyle={{ fontWeight: sharedStyles.bold }}/>
        </Appbar.Header>
    )
}

function MoreNavigator() {

    return (
        <Page>
            <NavigationContainer theme={CombinedTheme}>
                <Stack.Navigator
                    initialRouteName="More"
                    screenOptions={{header: HeaderBar}}>

                    <Stack.Screen name="More" component={MorePage} />
                    <Stack.Screen name="Settings" component={SettingsPage} />

                </Stack.Navigator>
            </NavigationContainer>
        </Page>
    );
}

export default MoreNavigator;
