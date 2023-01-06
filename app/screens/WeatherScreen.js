import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Platform, RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import { Appbar, Avatar, Card, Divider, Snackbar, Text } from "react-native-paper";

import colors from "../config/colors";
import sharedStyles from "../config/sharedStyles";
import utils from "../config/utils";


function renderWeatherView(weatherData) {

    if (weatherData === null) {
        return (
            <View style={{ justifyContent: "center" }}>
                <Text>An error occurred.</Text>
            </View>
        )
    }

    return (
        <View style={{ flex: 1 }}>
            <View style={styles.widgetContainer}>
                {renderCurrentWidget(weatherData)}
                {renderTodayWidget(weatherData.today)}
            </View>
            <Divider style={sharedStyles.divider} />
            {[...weatherData.hourly.entries()].map((entry) => renderHourlyCard(entry, weatherData.today))}
        </View>
    )

}

function renderCurrentWidget(weatherData) {

    const weatherStyle = getWeatherStyle(weatherData.hourly[0][3], weatherData.hourly[0][0],
                                         weatherData.today[3], weatherData.today[4]);

    return (
        <View style={[styles.widget, { marginRight: 7.5, backgroundColor: weatherStyle.secondary }]}>
            <Text style={[styles.widgetTitle, { color: weatherStyle.textColor }]}>
                Currently feels like:
            </Text>

            <View style={styles.widgetContent}>
                <Avatar.Icon
                    icon={`weather-${weatherStyle.icon}`}
                    size={70}
                    style={{ backgroundColor: weatherStyle.primary }}/>
                <Avatar.Text
                    label={`${weatherData.hourly[0][1]}ᶜ`}
                    labelStyle={[styles.currentWidgetTempLabel, { color: weatherStyle.textColor }]}
                    size={70}
                    style={styles.currentWidgetTempAvatar} />
            </View>

            <Text style={[styles.widgetSubtitle, { color: weatherStyle.textColor }]}>
                {weatherStyle.name}
            </Text>
        </View>
    );

}

function renderTodayWidget(todayData) {

    const weatherStyle = getWeatherStyle(todayData[0], todayData[3], todayData[3], todayData[4])

    return (
        <View style={[styles.widget, styles.todayWidget]}>
            <Text style={styles.widgetTitle}>Today's weather:</Text>

            <View style={styles.widgetContent}>
                <Avatar.Icon
                    icon={`weather-${weatherStyle.icon}`}
                    size={70}
                    style={{ backgroundColor: weatherStyle.primary }}/>
                <View style={styles.todayTemps}>
                    <Text style={[styles.todayTempText, { color: colors.red }]}>{todayData[1]}ᶜ</Text>
                    <Text style={[styles.todayTempText, { color: colors.blue }]}>{todayData[2]}ᶜ</Text>
                </View>
            </View>

            <Text style={styles.widgetSubtitle}>{weatherStyle.name}</Text>
        </View>
    );

}

function renderHourlyCard([index, hourData], todayData) {

    const weatherStyle = getWeatherStyle(hourData[3], hourData[0], todayData[3], todayData[4]);

    const renderLeftAvatar = () => (
        <Avatar.Icon
            icon={`weather-${weatherStyle.icon}`}
            size={45}
            style={{ backgroundColor: weatherStyle.primary }} />
    )
    const renderRightAvatar = () => (
        <Avatar.Text
            label={`${hourData[1]}ᶜ`}
            size={45}
            style={styles.hourlyTemp} />
    )

    return (
        <Card style={styles.hourlyCard} mode="outlined" key={index}>
            <Card.Title
                title={utils.convertTime(hourData[0].substring(11))}
                titleStyle={styles.cardTitle}
                titleVariant="titleLarge"
                subtitle={`${weatherStyle.name}, Precipitation ${hourData[2]}mm`}
                subtitleNumberOfLines={2}
                subtitleStyle={styles.cardSubtitle}
                left={renderLeftAvatar}
                right={renderRightAvatar} />
        </Card>
    );

}

function WeatherScreen() {

    const [weatherView, setWeatherView] = useState(
        <ActivityIndicator
            animating={true}
            color={colors.inverseSurface}
            size="large"
            style={styles.loadingAnimation} />
    );

    const refreshCooldown = 15;
    const [lastRefresh, setLastRefresh] = useState(new Date());
    const [lastRefreshMessage, setLastRefreshMessage] = useState("Updating...");
    const [refreshControlVisible, setRefreshControlVisible] = useState(false);
    const [refreshWarningVisible, setRefreshWarningVisible] = useState(false);

    function loadData(userTriggered) {

        const currentTime = new Date();

        if (userTriggered && currentTime - lastRefresh < refreshCooldown * 60000) {
            setRefreshWarningVisible(true);
            return;
        }

        setLastRefresh(currentTime)
        setLastRefreshMessage("Updating...")

        fetch("https://api.open-meteo.com/v1/forecast?latitude=43.4706&longitude=-80.5424&hourly=apparent_temperature,precipitation,weathercode&models=gfs_hrrr&daily=weathercode,apparent_temperature_max,apparent_temperature_min,sunrise,sunset&timezone=America%2FNew_York")
            .then((res) => res.json())
            .then((res) => {

                const pad = (number) => number.toString().padStart(2, "0");

                const now = new Date();
                const nowString = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
                const startIndex = res["hourly"].time.indexOf(`${nowString}T${pad(now.getHours())}:00`);
                const endIndex = res["hourly"].time.indexOf(`${nowString}T23:00`);
                const hourlyData = [];

                for (let i = startIndex; i <= endIndex; i++) {
                    hourlyData.push([
                        res["hourly"].time[i], Math.round(res["hourly"]["apparent_temperature"][i]),
                        res["hourly"]["precipitation"][i], res["hourly"]["weathercode"][i]
                    ])
                }

                setWeatherView(renderWeatherView({
                    hourly: hourlyData,
                    today: [
                        res["daily"]["weathercode"][0], Math.round(res["daily"]["apparent_temperature_max"][0]),
                        Math.round(res["daily"]["apparent_temperature_min"][0]), res["daily"]["sunrise"][0],
                        res["daily"]["sunset"][0]
                    ]
                }))

                setLastRefreshMessage(`Last updated at ${utils.generateTime(currentTime)}`)

            })
            /*.catch((e) => {
                console.log(e)
                setWeatherView(renderWeatherView(null))
                setLastRefreshMessage(`Last update attempt at ${utils.generateTime(currentTime)}`)
            })*/

    }
    useEffect(() => loadData(false), [])

    const onRefreshControl = () => {
        setRefreshControlVisible(true);
        loadData(true);
        setRefreshControlVisible(false);
    }

    return (

        <View style={sharedStyles.screen}>

            <Appbar.Header mode="small">
                <Appbar.Content title="Weather (Waterloo, ON)" />
                <Appbar.Action icon="refresh" onPress={() => loadData(true)} />
            </Appbar.Header>

            <ScrollView
                refreshControl={<RefreshControl onRefresh={onRefreshControl} refreshing={refreshControlVisible} />}
                style={sharedStyles.mainContainer}>

                <Text style={styles.subtitle}>{lastRefreshMessage}</Text>
                {weatherView}
                <Divider style={[sharedStyles.divider, { marginTop: 0 }]} />
                <Text style={styles.subtitle}>Data from Open-Meteo API</Text>
            </ScrollView>

            <Snackbar
                visible={refreshWarningVisible}
                onDismiss={() => setRefreshWarningVisible(false)}
                action={{ label: "OK" }}>

                You can only refresh once every 15 minutes.
            </Snackbar>

        </View>

    );
}


const styles = StyleSheet.create({

    loadingAnimation: {
        marginVertical: 20
    },
    subtitle: {
        marginBottom: 15,
        fontStyle: "italic"
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
const getWeatherStyle = (weathercode, hour, sunrise, sunset) => {

    const codeToStyle = {
        0: { name: "Sunny", icon: "cloudy", primary: "#ffe49c", secondary: "#9dbff2" },
        1: { name: "Mostly Clear", icon: "partly-cloudy", primary: "#ffe49c", secondary: "#91a3bf" },
        2: { name: "Parlty Cloudy", icon: "partly-cloudy", primary: "#ffe49c", secondary: "#91a3bf" },
        3: { name: "Cloudy", icon: "cloudy", primary: "#c2c2c2", secondary: "#b3b3b3" },
        45: { name: "Ice Fog", icon: "fog", primary: "#c2c2c2", secondary: "#b3b3b3" },
        48: { name: "Fog", icon: "fog", primary: "#c2c2c2", secondary: "#b3b3b3" },
        51: { name: "Drizzle", icon: "rainy", primary: "#c2c2c2", secondary: "#b3b3b3" },
        53: { name: "Drizzle", icon: "rainy", primary: "#c2c2c2", secondary: "#b3b3b3" },
        55: { name: "Heavy Drizzle", icon: "pouring", primary: "#bfbfbf", secondary: "#adadad" },
        56: { name: "Freezing Drizzle", icon: "snowy-rainy", primary: "#bcc6d6", secondary: "#b3b3b3" },
        57: { name: "Freezing Drizzle", icon: "snowy-rainy", primary: "#bcc6d6", secondary: "#b3b3b3" },
        61: { name: "Light Rain", icon: "rainy", primary: "#b6c6e3", secondary: "#a1b1cc" },
        63: { name: "Rain", icon: "pouring", primary: "#b6c6e3", secondary: "#a1b1cc" },
        65: { name: "Heavy Rain", icon: "pouring", primary: "#b6c6e3", secondary: "#a1b1cc" },
        66: { name: "Freezing Rain", icon: "snowy-rainy", primary: "#b6c6e3", secondary: "#a1b1cc" },
        67: { name: "Freezing Rain", icon: "snowy-rainy", primary: "#b6c6e3", secondary: "#a1b1cc" },
        71: { name: "Snow", icon: "snowy", primary: "#daeff5", secondary: "#bfd9e0" },
        73: { name: "Snow", icon: "snowy", primary: "#daeff5", secondary: "#bfd9e0" },
        75: { name: "Heavy Snow", icon: "snowy-heavy", primary: "#daeff5", secondary: "#bfd9e0" },
        77: { name: "Snow", icon: "snowy", primary: "#daeff5", secondary: "#bfd9e0" },
        80: { name: "Light Showers", icon: "rainy", primary: "#b6c6e3", secondary: "#a1b1cc" },
        81: { name: "Showers", icon: "pouring", primary: "#b6c6e3", secondary: "#a1b1cc" },
        82: { name: "Showers", icon: "pouring", primary: "#b6c6e3", secondary: "#a1b1cc" },
        85: { name: "Snow Showers", icon: "snowy", primary: "#daeff5", secondary: "#bfd9e0" },
        86: { name: "Snow Showers", icon: "snowy-heavy", primary: "#daeff5", secondary: "#bfd9e0" },
        95: { name: "Thunderstorms", icon: "lightning", primary: "#b09cba", secondary: "#9b85a6" },
    };

    let resultStyle = codeToStyle[weathercode];
    if ([0, 1, 2].includes(weathercode) && (new Date(hour) <= new Date(sunrise) || new Date(sunset) <= new Date(hour))) {
        if (weathercode === 0)
            resultStyle = { name: "Clear", icon: "night", primary: "#333d4f", secondary: "#202540" };
        else if (weathercode === 1)
            resultStyle = { name: "Partly Cloudy", icon: "night-partly-cloudy", primary: "#43434d", secondary: "#202540" };
        else
            resultStyle = { name: "Partly Cloudy", icon: "night-partly-cloudy", primary: "#43434d", secondary: "#202540" };
        resultStyle.textColor = colors.inverseSurface;
    } else {
        resultStyle.textColor = colors.background;
    }

    return resultStyle;

}


export default WeatherScreen;
