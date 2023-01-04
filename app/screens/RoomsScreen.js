import React from 'react';
import { View } from "react-native";
import { Appbar, Text } from "react-native-paper";
import sharedStyles from "../config/sharedStyles";


function RoomsScreen(props) {

    return (
        <View style={sharedStyles.screen}>

            <Appbar.Header mode="small">
                <Appbar.Content title="Open Classrooms" />
            </Appbar.Header>

            <View style={{ alignItems: "center", flex: 1, justifyContent: "center" }}>
                <Text style={{ fontSize: 24 }}>Coming soon!</Text>
            </View>

        </View>
    );
}

export default RoomsScreen;
