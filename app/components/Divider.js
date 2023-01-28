import React from "react";
import { StyleSheet } from "react-native";
import colors from "../config/colors";
import { Divider as PaperDivider } from "react-native-paper";


function Divider() {

    return (

        <PaperDivider style={styles.divider} />

    );

}

const styles = StyleSheet.create({
    divider: {
        backgroundColor: colors.outline,
        marginVertical: 15
    }
})


export default Divider;
