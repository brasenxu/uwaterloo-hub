import moment from "moment";
import React, { useEffect, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import { ActivityIndicator, Appbar, Avatar, Divider, List, Snackbar, Text } from "react-native-paper";

import colors from "../../config/colors";
import sharedStyles from "../../config/sharedStyles";
import utils from "../../config/utils";


function renderRoomsView(roomsData) {

    roomsData = parseRoomsData(roomsData);

    return roomsData.map(renderBuilding)

}

function parseRoomsData(roomsData) {

    const now = moment()

    const buildings = [];
    const nameReplacements = {
            "EIT": "Environmental and Information Technology",
            "EXP": "Health Expansion",
            "DC": "Davis Computer Research Centre",
            "HH": "Hagey Hall",
            "QNC": "Quantum Nano Centre"
        };

    for (const building of roomsData.data.features) {

        const code = building.properties["buildingCode"];
        let name = building.properties["buildingName"];
        const classrooms = parseBuilding(building, now);

        if (code in nameReplacements)
            name = nameReplacements[code];

        buildings.push({ code, name, classrooms });

    }

    return buildings.sort((a, b) => {
        if (a.classrooms.length === 0 && b.classrooms.length === 0)
            return a.code > b.code ? 1 : -1;
        if (a.classrooms.length === 0)
            return 1;
        if (b.classrooms.length === 0)
            return -1;
        return a.code > b.code ? 1 : -1
    });

}

function parseBuilding(building, now) {

    const classrooms = []
    for (const classroom of JSON.parse(building.properties["openClassroomSlots"]).data) {
        const schedule = parseClassroomSchedule(classroom["Schedule"], now);
        if (schedule !== null)
            classrooms.push({ number: classroom["roomNumber"], start: schedule.start, end: schedule.end })
    }

    return classrooms

}

function parseClassroomSchedule(schedule, now) {

    for (const weekday of schedule) {
        if (weekday["Weekday"] === now.format("dddd")) {
            return parseSlots(weekday["Slots"], now);
        }
    }

    return null;

}

function parseSlots(slots, now) {

    for (const slot of slots) {
        const start = moment(slot['StartTime'], "HH:mm:00")
        const end = moment(slot['EndTime'], "HH:mm:00")
        if (start <= now && now <= end)
            return { start, end }
    }

    return null;

}

function renderBuilding(building) {

    const primaryStyle = building.classrooms.length === 0 ? colors.red : colors.green;
    const containerStyle = building.classrooms.length === 0 ? colors.redContainer : colors.greenContainer;
    const fillerAvatar = <Avatar.Text size={45} style={styles.fillerAvatar} />;

    function renderLeftAvatar() {
        return (
            <Avatar.Text
                label={building.code}
                labelStyle={{ fontSize: 14 }}
                size={45}
                style={{ backgroundColor: containerStyle }}/>
        );
    }

    function renderClassroom(classroom) {
        return (
            <List.Item
                title={`${building.code} ${classroom.number}`}
                description={`${classroom.start.format(utils.getTimeFormat())} - ${classroom.end.format(utils.getTimeFormat())}`}
                left={() => fillerAvatar}
                key={`${building.code}${classroom.number}`}/>
        )
    }

    return (
        <View key={`${building.code}-view`}>
            <Divider key={`${building.code}-divider`}/>
            <List.Accordion
                key={building.code}
                left={renderLeftAvatar}
                title={building.name}
                theme={{ colors: { primary: primaryStyle } }} >

                {building.classrooms.map(renderClassroom)}
            </List.Accordion>
        </View>
    )

}

function RoomsScreen() {

    const [roomsView, setRoomsView] = useState(
        <ActivityIndicator
            animating={true}
            color={colors.inverseSurface}
            style={sharedStyles.loadingAnimation} />
    );

    const [refreshCooldown, setRefreshCooldown] = useState(15);
    const [lastRefresh, setLastRefresh] = useState(new Date());
    const [lastRefreshMessage, setLastRefreshMessage] = useState("Updating...");
    const [refreshControlVisible, setRefreshControlVisible] = useState(false);
    const [refreshWarningVisible, setRefreshWarningVisible] = useState(false);

    function loadData(userTriggered) {

        const now = new Date();

        if (userTriggered && now - lastRefresh < refreshCooldown * 60000) {
            setRefreshWarningVisible(true);
            return;
        }

        setLastRefresh(now)
        setLastRefreshMessage("Updating...")

        fetch("https://portalapi2.uwaterloo.ca/v2/map/OpenClassrooms")
            .then(res => res.json())
            .then(res => {
                setRefreshCooldown(15);
                setLastRefreshMessage(`Last updated at ${utils.generateTime(now)}`);
                setRoomsView(renderRoomsView(res));
            })

    }
    useEffect(() => loadData(false), []);

    function onRefreshControl() {
        setRefreshControlVisible(true);
        loadData(true);
        setRefreshControlVisible(false);
    }

    return (
        <View style={sharedStyles.screen}>

            <Appbar.Header mode="small">
                <Appbar.Content title="Open Classrooms" />
                <Appbar.Action icon="refresh" onPress={() => loadData(true)} />
            </Appbar.Header>

            <ScrollView
                showsVerticalScrollIndicator={false}
                refreshControl={<RefreshControl onRefresh={onRefreshControl} refreshing={refreshControlVisible} />}
                style={sharedStyles.mainContainer}>

                <Text style={sharedStyles.subtitle}>{lastRefreshMessage}</Text>
                {roomsView}
            </ScrollView>

            <Snackbar
                action={{ label: "OK" }}
                children={`You can only refresh once every ${refreshCooldown} minutes`}
                onDismiss={() => setRefreshWarningVisible(false)}
                visible={refreshWarningVisible} />

        </View>
    );
}


const styles = StyleSheet.create({

    fillerAvatar: {
        backgroundColor: "transparent"
    },

})


export default RoomsScreen;
