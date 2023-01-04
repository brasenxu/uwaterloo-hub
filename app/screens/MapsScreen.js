import React from 'react';
import { StyleSheet, View } from "react-native";
import { Appbar, Text } from "react-native-paper";

import sharedStyles from "../config/sharedStyles";


function MapsScreen(props) {
    return (
        <View style={sharedStyles.screen}>

            <Appbar.Header mode="small">
                <Appbar.Content title="Maps" />
            </Appbar.Header>

            <View style={{ alignItems: "center", flex: 1, justifyContent: "center" }}>
                <Text style={{ fontSize: 24 }}>Coming soon!</Text>
            </View>

        </View>
    );
}


const styles = StyleSheet.create({

})


export default MapsScreen;
