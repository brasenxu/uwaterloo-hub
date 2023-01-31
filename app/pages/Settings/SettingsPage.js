import React, { useContext } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { MD3DarkTheme, Text } from "react-native-paper";
import Category from "../../components/Category";
import { Settings } from "../../settings";
import { Default, Violet } from "../../config/themes";


function SettingsPage() {

    const settings = useContext(Settings);
    const themes = [[Default, "Default"], [Violet, "Violet"]]

    const themeControl = themes.map(theme => {

        const name = theme[1];
        theme = theme[0];
        const outline = theme == settings.theme.colors ? theme.primary : Default.outlineVariant;

        return (
            <View key={"theme " + name} >
                <Pressable
                    style={[styles.themeCard, { backgroundColor: theme.background, borderColor: outline }]}
                    onPress={() => settings.setTheme({ ...MD3DarkTheme, colors: theme })}
                    key={"pressable " + name}>
                    <View style={[styles.primaryCircle, { backgroundColor: theme.primary }]} key={"circle " + name} />
                </Pressable>
                <View style={{ width: 100, alignItems: "center", marginTop: 5 }} >
                    <Text>{name}</Text>
                </View>
            </View>
        );

    });

    return (

        <View>
            <Category title="Appearance">
                <Text variant="bodyLarge" style={{marginTop: 15}}>Theme</Text>
                <ScrollView style={{ marginVertical: 10 }} horizontal={true}>
                    {themeControl}
                </ScrollView>
            </Category>
        </View>

    );

}

const styles = StyleSheet.create({
    primaryCircle: {
        borderRadius: 12,
        height: 24,
        marginBottom: 20,
        marginLeft: 15,
        width: 24,
    },
    themeCard: {
        borderRadius: 20,
        borderWidth: 5,
        height: 150,
        justifyContent: "flex-end",
        marginRight: 10,
        width: 100,
    }
})


export default SettingsPage;
