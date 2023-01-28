import React from 'react';
import { StyleSheet, View } from "react-native";
import { Appbar } from "react-native-paper";
import sharedStyles from "../config/sharedStyles";


function Page({ actions, children, title }) {

    let actionsComponent = undefined;
    let headerComponent = undefined

    if (actions) {
        actionsComponent = actions.map((icon, onPress) => <Appbar.Action icon={icon} onPress={onPress} key={icon} />);
    }

    if (title) {
        headerComponent = (
            <Appbar.Header mode="small">
                <Appbar.Content title={title} titleStyle={{ fontWeight: sharedStyles.bold }} />
                {actionsComponent}
            </Appbar.Header>
        );
    }

    return (
        <View style={styles.page}>
            {headerComponent}
            {children}
        </View>
    );

}

const styles = StyleSheet.create({
    page: { flex: 1 }
})

export default Page;