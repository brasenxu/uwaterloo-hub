import React from 'react';
import { ScrollView } from "react-native";

import ListMenuItem from "../../components/ListMenuItem";
import Page from "../../components/Page";
import Category from "../../components/Category";
import { Text } from "react-native-paper";


function SettingsPage(props) {

    return (
        <Page title="Settings">
            <Category title="Appearance">
                <Text>hello</Text>
            </Category>
            <Category title="Appearance">

            </Category>
            <ScrollView>

                <ListMenuItem
                    icon="palette-outline" onPress={() => console.log("appearance")}
                    title="Appearance" subtitle="Theme, date & time format, unit system" />
                <ListMenuItem
                    icon="cloud-outline" onPress={() => console.log("weather")}
                    title="Weather" subtitle="Data format, data details" />
                <ListMenuItem
                    icon="compass-outline" onPress={() => console.log("maps")}
                    title="Maps" subtitle="TBD" />
                <ListMenuItem
                    icon="calendar" onPress={() => console.log("schedule")}
                    title="Schedule" subtitle="TBD" />

            </ScrollView>
        </Page>
    );
}

export default SettingsPage;
