import React from 'react';
import { Avatar, Text, TouchableRipple } from "react-native-paper";
import { StyleSheet, View } from "react-native";

import colors from "../config/colors";

function MenuItem({ title, subtitle, icon, onPress }) {

    return (
        <TouchableRipple onPress={onPress} rippleColor="#ffffff40">
            <View style={styles.item}>
                <Avatar.Icon size={50} icon={icon} color={colors.primary} style={styles.iconAvatar} />
                <View style={styles.textContainer}>
                    <Text variant="titleMedium">{title}</Text>
                    {subtitle ? <Text variant="bodySmall">{subtitle}</Text> : undefined}
                </View>
            </View>
        </TouchableRipple>
    );

}

const styles = StyleSheet.create({

    iconAvatar: {
        backgroundColor: "transparent"
    },
    item: {
        flexDirection: "row",
        marginHorizontal: 10,
        marginVertical: 7
    },
    textContainer: {
        justifyContent: "center",
        marginLeft: 10
    }

})

export default MenuItem;