import React from "react";
import { StyleSheet } from "react-native";
import colors from "../config/colors";
import { Divider as PaperDivider } from "react-native-paper";


function Divider({ margin }) {

    return (

        <PaperDivider style={[styles.divider, { marginVertical: margin ? margin : 0 }]} />

    );

}

const styles = StyleSheet.create({
    divider: {
        backgroundColor: colors.outline,
    }
})


export default Divider;
