import React from 'react';
import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import colors from "../config/colors";

function Category(props) {
    return (
        <View style={styles.category}>
            <Text variant="titleSmall" style={styles.title}>{props.title}</Text>
            {props.children}
        </View>
    );
}

const styles = StyleSheet.create({
    category: {
        marginHorizontal: 17,
        marginBottom: 20
    },
    title: { color: colors.primary }
})

export default Category;
