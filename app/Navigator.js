import React from "react";
import { Pressable } from "react-native";
import { BottomNavigation } from "react-native-paper";

import MapsScreen from "./screens/MapsScreen";
import MoreNavigator from "./screens/More/MoreNavigator";
import RoomsScreen from "./screens/RoomsScreen";
import ScheduleScreen from "./screens/ScheduleScreen";
import WeatherScreen from "./screens/WeatherScreen";


const Navigator = () => {

    const [index, setIndex] = React.useState(2);
    const [routes] = React.useState([
        { key: "weather", title: "Weather", focusedIcon: "cloud", unfocusedIcon: "cloud-outline"},
        { key: "maps", title: "Maps", focusedIcon: "compass", unfocusedIcon: "compass-outline" },
        { key: "schedule", title: "Schedule", focusedIcon: "calendar" },
        { key: "classroom", title: "Rooms", focusedIcon: "map-marker", unfocusedIcon: "map-marker-outline" },
        { key: "settings", title: "Settings", focusedIcon: "cog", unfocusedIcon: "cog-outline" },
    ]);

    const renderScene = BottomNavigation.SceneMap({
        weather: WeatherScreen,
        maps: MapsScreen,
        schedule: ScheduleScreen,
        classroom: RoomsScreen,
        settings: MoreNavigator
    });

    return (
        <BottomNavigation
            navigationState={{ index, routes }}
            onIndexChange={setIndex}
            renderScene={renderScene}
            renderTouchable={(touchableProps) => <Pressable {...touchableProps}/>}
            sceneAnimationEnabled={true}
        />
    );

};


export default Navigator;