import React from 'react';
import { StyleSheet, View } from "react-native";
import { Appbar } from "react-native-paper";
import sharedStyles from "../config/sharedStyles";


function renderActions(actions) {

    if (!actions) {
        return undefined;
    }

    return actions.map((icon, onPress) => <Appbar.Action icon={icon} onPress={onPress} key={icon} />)

}

function Page(props) {

    return (

        <View style={[styles.page, { marginHorizontal: props.padSides ? 15 : 0}]}>
            <Appbar.Header mode="small">
                <Appbar.Content title={props.title} titleStyle={{ fontWeight: sharedStyles.bold }} />
                {renderActions(props.actions)}
            </Appbar.Header>
            {props.children}
        </View>

    );

}

const styles = StyleSheet.create({
    page: { flex: 1 }
})

export default Page;