import React, { useEffect, useState } from 'react';
import { Platform, RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import { ActivityIndicator, Appbar, Avatar, Card, Divider, Snackbar, Text } from "react-native-paper";

import colors from "../../config/colors";
import sharedStyles from "../../config/sharedStyles";
import utils from "../../config/utils";


function renderWeatherView(weatherData) {

    if (weatherData === null) {
        return (
            <View style={{ justifyContent: "center" }}>
                <Text style={styles.errorMessage}>Something went wrong.</Text>
            </View>
        );
    }

    weatherData = parseWeatherData(weatherData)

    return (
        <View style={{ flex: 1 }}>
            <View style={styles.widgetContainer}>
                {renderCurrentWidget(weatherData)}
                {renderTodayWidget(weatherData.today)}
            </View>
            <Divider style={sharedStyles.divider} />
            {[...weatherData.hourly.entries()].map((entry) => renderHourlyCard(entry, weatherData.today))}
        </View>
    );

}

function parseWeatherData(weatherData) {

    const now = new Date();
    const nowString = `${now.getFullYear()}-${utils.pad(now.getMonth() + 1)}-${utils.pad(now.getDate())}`;
    const startIndex = weatherData["hourly"].time.indexOf(`${nowString}T${utils.pad(now.getHours())}:00`);
    const endIndex = weatherData["hourly"].time.indexOf(`${nowString}T23:00`);
    const hourlyData = [];

    for (let i = startIndex; i <= endIndex; i++) {
        hourlyData.push([
            weatherData["hourly"].time[i], Math.round(weatherData["hourly"]["apparent_temperature"][i]),
            weatherData["hourly"]["precipitation"][i], weatherData["hourly"]["weathercode"][i]
        ]);
    }

    return {
        hourly: hourlyData,
        today: [
            weatherData["daily"]["weathercode"][0], Math.round(weatherData["daily"]["apparent_temperature_max"][0]),
            Math.round(weatherData["daily"]["apparent_temperature_min"][0]), weatherData["daily"]["sunrise"][0],
            weatherData["daily"]["sunset"][0]
        ]
    }

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

    const weatherStyle = getWeatherStyle(todayData[0], todayData[3], todayData[3], todayData[4]);

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
    );
    const renderRightAvatar = () => (
        <Avatar.Text
            label={`${hourData[1]}ᶜ`}
            size={45}
            style={styles.hourlyTemp} />
    );

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

function WeatherPage() {

    const [weatherView, setWeatherView] = useState(
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

        setLastRefresh(now);
        setLastRefreshMessage("Updating...");

        fetch("https://api.open-meteo.com/v1/forecast?latitude=43.4706&longitude=-80.5424&hourly=apparent_temperature,precipitation,weathercode&models=gfs_hrrr&daily=weathercode,apparent_temperature_max,apparent_temperature_min,sunrise,sunset&timezone=America%2FNew_York")
            .then(res => res.json())
            .then(res => {
                setRefreshCooldown(15);
                setLastRefreshMessage(`Last updated at ${utils.generateTime(now)}`);
                setWeatherView(renderWeatherView(res));
            })
            .catch(() => {
                setRefreshCooldown(0);
                setLastRefreshMessage(`Last update attempt at ${utils.generateTime(now)}`);
                setWeatherView(renderWeatherView(null));
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
                <Appbar.Content title="Weather (Waterloo, ON)" />
                <Appbar.Action icon="refresh" onPress={() => loadData(true)} />
            </Appbar.Header>

            <ScrollView
                showsVerticalScrollIndicator={false}
                refreshControl={<RefreshControl onRefresh={onRefreshControl} refreshing={refreshControlVisible} />}
                style={sharedStyles.mainContainer}>

                <Text style={sharedStyles.subtitle}>{lastRefreshMessage}</Text>
                {weatherView}
                <Divider style={[sharedStyles.divider, { marginTop: 0 }]} />
                <Text style={sharedStyles.subtitle}>Data from Open-Meteo's API</Text>
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

    errorMessage: {
        fontWeight: sharedStyles.bold,
        marginBottom: 15,
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
    if (weathercode in [0, 1, 2] && (new Date(hour) <= new Date(sunrise) || new Date(sunset) <= new Date(hour))) {
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


export default WeatherPage;
