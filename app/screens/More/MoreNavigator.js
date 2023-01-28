import React from 'react';
import { View } from "react-native";
import Page from "../../components/Page";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer, DarkTheme as NavDarkTheme, DarkTheme } from "@react-navigation/native";
import colors from "../../config/colors";
import { Appbar, MD3DarkTheme } from "react-native-paper";
import MorePage from "./MorePage";


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
            <Appbar.Content title="More" />
        </Appbar.Header>
    )
}

function MoreNavigator(props) {

    return (
        <Page>
            <NavigationContainer theme={CombinedTheme}>
                <Stack.Navigator
                    initialRouteName="More"
                    screenOptions={{header: HeaderBar}}>

                    <Stack.Screen name="More" component={MorePage} />
                </Stack.Navigator>
            </NavigationContainer>
        </Page>
    );
}

export default MoreNavigator;
