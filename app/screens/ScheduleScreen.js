import React, { useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { Appbar, Avatar, Card, Paragraph, Text } from "react-native-paper";

import sharedStyles from "../config/sharedStyles";

function ScheduleScreen(props) {
    const [cards, setCards] = useState([
        {
            name: "MATH 135",
            date: "Jan 1st",
            weekday: "Mon",
            time: "12:00pm - 12:50pm",
            location: "MC 4021 (Mathematics and Computer)",
        },
        {
            name: "MATH 136",
            date: "Jan 1st",
            weekday: "Mon",
            time: "12:00pm - 12:50pm",
            location: "MC 4021 (Mathematics and Computer)",
        },
        {
            name: "MATH 137",
            date: "Jan 1st",
            weekday: "Mon",
            time: "12:00pm - 12:50pm",
            location: "MC 4021 (Mathematics and Computer)",
        },
        {
            name: "MATH 138",
            date: "Jan 1st",
            weekday: "Mon",
            time: "12:00pm - 12:50pm",
            location: "MC 4021 (Mathematics and Computer)",
        },
        {
            name: "MATH 139",
            date: "Jan 1st",
            weekday: "Mon",
            time: "12:00pm - 12:50pm",
            location: "MC 4021 (Mathematics and Computer)",
        },
        {
            name: "MATH 140",
            date: "Jan 1st",
            weekday: "Mon",
            time: "12:00pm - 12:50pm",
            location: "MC 4021 (Mathematics and Computer)",
        },
        {
            name: "MATH 141",
            date: "Jan 1st",
            weekday: "Mon",
            time: "12:00pm - 12:50pm",
            location: "MC 4021 (Mathematics and Computer)",
        },
        {
            name: "MATH 142",
            date: "Jan 1st",
            weekday: "Mon",
            time: "12:00pm - 12:50pm",
            location: "MC 4021 (Mathematics and Computer)",
        },
    ]);

    const renderCard = ({ item }) => {
        return (
            <Card style={styles.card} mode="outlined">
                <Card.Title
                    title={item.name}
                    titleStyle={styles.cardTitle}
                    titleVariant="titleLarge"
                    subtitle={`${item.date}, ${item.time}`}
                    left={() => (
                        <Avatar.Text
                            size={40}
                            labelStyle={styles.weekdayAvatar}
                            label={item.weekday}
                        />
                    )}
                />
                <Card.Content>
                    <Paragraph>{item.location}</Paragraph>
                </Card.Content>
            </Card>
        );
    };

    const [isLoading, setLoading] = useState(false);

    const handleRefresh = () => {
        // let API_URL = "https://jsonplaceholder.typicode.com/posts";
        setLoading(true);
        setCards([
            ...cards,
            {
                name: "MATH Brasen",
                date: "Jan 1st",
                weekday: "Mon",
                time: "12:00pm - 12:50pm",
                location: "MC 4021 (Mathematics and Computer)",
            },
        ]);
        setLoading(false);

        // fetch(API_URL)
        //   .then((res) => res.json())
        //   .then((res) => {
        //     console.log("refeshed");
        //   })
        //   .finally(() => setLoading(false));
    };

    return (
        <View style={sharedStyles.screen}>
            <Appbar.Header mode="small">
                <Appbar.Content title="Schedule" />
                <Appbar.Action
                    icon="magnify"
                    onPress={() => console.log("search schedule")}
                />
                <Appbar.Action
                    icon="plus"
                    onPress={() => console.log("add schedule")}
                />
            </Appbar.Header>

            {/* <View style={{ alignItems: "center", flex: 1, justifyContent: "center" }}>
                <Text style={{ fontSize: 24 }}>Coming soon!</Text>
            </View> */}

            <FlatList
                data={cards}
                renderItem={renderCard}
                refreshing={isLoading}
                onRefresh={handleRefresh}
                showsVerticalScrollIndicator={false}
                style={sharedStyles.mainContainer}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        marginBottom: 15,
    },
    cardTitle: {
        fontWeight: sharedStyles.bold,
    },
    weekdayAvatar: {
        fontSize: 14,
        fontWeight: sharedStyles.bold,
    },
});

export default ScheduleScreen;
