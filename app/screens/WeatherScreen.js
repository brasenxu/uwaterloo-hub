import React from 'react';
import { ActivityIndicator, Platform, RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import { Appbar, Avatar, Card, Divider, Snackbar, Text } from "react-native-paper";

import colors from "../config/colors";
import sharedStyles from "../config/sharedStyles";
import utils from "../config/utils";


function WeatherScreen() {

    const [dataContainer, setDataContainer] = React.useState(
        <ActivityIndicator
            animating={true}
            color={colors.inverseSurface}
            size="large"
            style={styles.loadingAnimation}
        />
    );
    const [lastUpdated, setLastUpdated] = React.useState(new Date())
    const [lastUpdatedMessage, setlastUpdatedMessage] = React.useState("Updating...")
    const [refreshing, setRefreshing] = React.useState(false)
    const [reloadWarningVisible, setReloadWarningVisible] = React.useState(false)

    const loadData = (userTriggered) => {

        if (userTriggered && Math.floor(lastUpdated.getMinutes()/15) === Math.floor(new Date().getMinutes()/15)) {
            setReloadWarningVisible(true)
            return;
        }

        const re = /gc">(\w\w:\w\w).*?bol-(.*?)".*?Ax">(.*?)<.*?ue">(.*?)<.*?D0-">(.*?)°/g
        const url = "https://weather.com/en-CA/weather/hourbyhour/l/88c8a39a86dd3660d2c40ad9d57fee7b8e7c6bd982a2905ea749df75999eb4db"
        const currentTime = new Date()
        setLastUpdated(currentTime)
        setlastUpdatedMessage("Updating...")

        fetch(url)
            .then((res) => res.text())
            .then((res) => {

                let hourlyData = [...res.matchAll(re)].map((hour) => hour.slice(1, 6))

                if (hourlyData[0][0] !== "00:00"){
                    const newHourlyData = [];
                    for (const hour of hourlyData) {
                        if (hour[0] === "00:00")
                            break;
                        newHourlyData.push(hour);
                    }
                    hourlyData = newHourlyData;
                }

                setlastUpdatedMessage(`Last updated at ${utils.generateTime(currentTime)}`);
                setDataContainer(renderDataContainer(hourlyData));
            })
    }
    const onRefresh = () => {
        setRefreshing(true);
        loadData(true);
        setRefreshing(false);
    }

    React.useEffect(() => {loadData(false)}, [])

    const renderDataContainer = (hourlyData) => {
        return (
            <View style={{flex: 1}}>
                <View style={styles.widgetContainer}>
                    {renderCurrentCard(hourlyData[0])}
                    {renderTodayCard(hourlyData)}
                </View>
                <Divider style={sharedStyles.divider} />
                {[...hourlyData.entries()].map(renderHour)}
            </View>
        );
    };
    const renderCurrentCard = (currentHour) => {

        const { icon, textColor, primary, secondary } = getWeatherStyle(currentHour[2], currentHour[1]);

        return (
            <View style={[styles.widget, { marginRight: 7.5, backgroundColor: secondary }]}>
                <Text style={[styles.widgetTitle, textColor]}>Currently feels like:</Text>

                <View style={styles.widgetContent}>
                    <Avatar.Icon
                        icon={`weather-${icon}`}
                        size={70}
                        style={{ backgroundColor: primary }}/>
                    <Avatar.Text
                        label={`${currentHour[4]}ᶜ`}
                        labelStyle={[styles.currentWidgetTempLabel, textColor]}
                        size={70}
                        style={styles.currentWidgetTempAvatar} />
                </View>

                <Text style={[styles.widgetSubtitle, textColor]}>{currentHour[2]}</Text>
            </View>
        );
    };
    const renderTodayCard = (hourlyData) => {

        const maxTemp = Math.max(...hourlyData.map((hour) => hour[4]));
        const minTemp = Math.min(...hourlyData.map((hour) => hour[4]));
        const conditions = hourlyData.map((hour) => hour[2]);
        const conditionImportance = [
            "Thunderstorms", "Scattered Thunderstorms", "Rain", "Showers", "Light Snow", "Few Snow Showers",
            "Light Rain", "Few Showers", "Cloudy", "Mostly Cloudy", "Partly Cloudy", "Mostly Clear", "Mostly Sunny",
            "Clear", "Sunny"];
        let worstCondition = "Sunny"

        for (const condition of conditionImportance) {
            if (conditions.includes(condition)){
                worstCondition = condition;
                break;
            }
        }

        return (
            <View style={[styles.widget, styles.todayWidget]}>
                <Text style={styles.widgetTitle}>Today's weather:</Text>

                <View style={styles.widgetContent}>
                    <Avatar.Icon
                        icon={`weather-${styleMap[worstCondition]}`}
                        size={70}
                        style={{ backgroundColor: getWeatherStyle(worstCondition, "sun").primary }}/>
                    <View style={styles.todayTemps}>
                        <Text style={[styles.todayTempText, { color: colors.red }]}>{maxTemp}ᶜ</Text>
                        <Text style={[styles.todayTempText, { color: colors.blue }]}>{minTemp}ᶜ</Text>
                    </View>
                </View>

                <Text style={styles.widgetSubtitle}>{worstCondition}</Text>
            </View>
        );
    };
    const renderHour = ([index, hour]) => {

        const renderLeftAvatar = () => (
            <Avatar.Icon
                icon={`weather-${styleMap[hour[2]]}`}
                size={45}
                style={{ backgroundColor: getWeatherStyle(hour[2], "sun").primary }} />
        )
        const renderRightAvatar = () => (
            <Avatar.Text
                label={`${hour[4]}ᶜ`}
                size={45}
                style={styles.hourlyTemp} />
        )

        return (
            <Card style={styles.hourlyCard} mode="outlined" key={index}>
                <Card.Title
                    title={utils.convertTime(hour[0])}
                    titleStyle={styles.cardTitle}
                    titleVariant="titleLarge"
                    subtitle={`${hour[2]}, Precipitation ${hour[3]}`}
                    subtitleNumberOfLines={2}
                    subtitleStyle={styles.cardSubtitle}
                    left={renderLeftAvatar}
                    right={renderRightAvatar} />
            </Card>
        );
    };

    return (
        <View style={sharedStyles.screen}>

            <Appbar.Header mode="small">
                <Appbar.Content title="Weather (Waterloo, ON)" />
                <Appbar.Action icon="refresh" onPress={() => loadData(true)} />
            </Appbar.Header>

            <ScrollView
                refreshControl={<RefreshControl onRefresh={onRefresh} refreshing={refreshing} />}
                style={sharedStyles.mainContainer}>

                <Text style={styles.updatedText}>{lastUpdatedMessage}</Text>
                {dataContainer}
            </ScrollView>

            <Snackbar
                visible={reloadWarningVisible}
                onDismiss={() => setReloadWarningVisible(false)}
                action={{ label: "OK" }}>

                You can only refresh once every 15 minutes.
            </Snackbar>

        </View>
    );
}


const styleMap = {
        "Clear": "sunny",
        "Cloudy": "cloudy",
        "Few Showers": "rainy",
        "Few Snow Showers": "snowy",
        "Light Rain": "rainy",
        "Light Snow": "snowy",
        "Mostly Clear": "sunny",
        "Mostly Cloudy": "cloudy",
        "Mostly Sunny": "sunny",
        "Partly Cloudy": "partly-cloudy",
        "Rain": "pouring",
        "Scattered Thunderstorms": "lightning",
        "Showers": "pouring",
        "Snow Showers": "snowy-heavy",
        "Sunny": "sunny",
        "Thunderstorms": "lightning",
    };
const getWeatherStyle = (weather, skyData) => {

    const weatherStyles = {
        "cloudy": {
            primary: "rgb(190, 190, 190)",
            secondary: "rgb(170, 170, 170)"
        },
        "lightning": {
            primary: "rgb(170, 150, 180)",
            secondary: "rgb(150, 130, 160)"
        },
        "night":  {
            primary: "rgb(55, 65, 85)",
            secondary: "rgb(30, 35, 60)"
        },
        "night-partly-cloudy":  {
            primary: "rgb(70, 70, 80)",
            secondary: "rgb(30, 35, 60)"
        },
        "partly-cloudy": {
            primary: "rgb(190, 190, 190)",
            secondary: "rgb(170, 170, 170)"
        },
        "pouring": {
            primary: "rgb(160, 175, 200)",
            secondary: "rgb(140, 155, 180)"
        },
        "rainy": {
            primary: "rgb(180, 195, 220)",
            secondary: "rgb(160, 175, 200)"
        },
        "snowy": {
            primary: "rgb(225, 245, 250)",
            secondary: "rgb(205, 225, 230)"
        },
        "snowy-heavy": {
            primary: "rgb(225, 245, 250)",
            secondary: "rgb(205, 225, 230)"
        },
        "snowy-rainy": {
            primary: "rgb(225, 245, 250)",
            secondary: "rgb(205, 225, 230)"
        },
        "sunny": {
            primary: "rgb(255, 225, 140)",
            secondary: "rgb(165, 195, 240)"
        }
    };
    let style = styleMap[weather]
    let textColor = colors.background

    if (["sunny", "partly-cloudy"].includes(style) && skyData === "moon") {
        style = (style === "sunny") ? "night" : "night-partly-cloudy"
        textColor = colors.inverseSurface
    }

    return {
        icon: style,
        textColor: { color: textColor },
        ...weatherStyles[style]
    };

}

const styles = StyleSheet.create({

    updatedText: {
        marginBottom: 15,
        fontStyle: "italic"
    },
    loadingAnimation: {
        marginTop: 30
    },

    widgetContainer: {
        flexDirection: "row",
        justifyContent: "space-between"
    },
    widget: {
        alignItems: "center",
        aspectRatio: 1,
        borderRadius: 25,
        flex: 1,
        justifyContent: "center"
    },
    widgetTitle: {
        fontSize: 15,
        textAlign: "center"
    },
    widgetContent: {
        flexDirection: "row",
        marginVertical: 10
    },
    widgetSubtitle: {
        fontSize: 18,
        fontWeight: sharedStyles.bold,
        textAlign: "center"
    },

    currentWidgetTempAvatar: {
        backgroundColor: "transparent",
    },
    currentWidgetTempLabel: {
        fontSize: Platform.OS === "android" ? 32 : 28,
        fontWeight: sharedStyles.bold
    },
    todayWidget: {
        borderColor: colors.outline,
        borderWidth: 1,
        marginLeft: 7.5
    },
    todayTemps: {
        alignItems: "center",
        aspectRatio: 1,
        justifyContent: "center"
    },
    todayTempText: {
        fontWeight: sharedStyles.bold,
        fontSize: 20
    },

    hourlyCard: {
        marginBottom: 15
    },
    cardTitle: {
        fontWeight: sharedStyles.bold,
        paddingTop: 5
    },
    cardSubtitle: {
        paddingBottom: 5
    },
    hourlyTemp: {
        backgroundColor: "transparent",
        marginRight: 15,
    }

})


export default WeatherScreen;
