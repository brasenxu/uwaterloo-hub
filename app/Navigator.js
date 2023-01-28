import React from "react";
import { Pressable } from "react-native";
import { BottomNavigation } from "react-native-paper";

import MapsScreen from "./screens/Maps/MapsScreen";
import MoreNavigator from "./screens/More/MoreNavigator";
import RoomsScreen from "./screens/Rooms/RoomsScreen";
import ScheduleScreen from "./screens/ScheduleScreen";
import WeatherPage from "./screens/Weather/WeatherPage";


function Navigator() {

    const [index, setIndex] = React.useState(2);
    const [routes] = React.useState([
        { key: "weather", title: "Weather", focusedIcon: "cloud", unfocusedIcon: "cloud-outline"},
        { key: "maps", title: "Maps", focusedIcon: "compass", unfocusedIcon: "compass-outline" },
        { key: "schedule", title: "Schedule", focusedIcon: "calendar" },
        { key: "classroom", title: "Rooms", focusedIcon: "map-marker", unfocusedIcon: "map-marker-outline" },
        { key: "more", title: "More", focusedIcon: "dots-horizontal", unfocusedIcon: "dots-horizontal" }
    ]);

    const renderScene = BottomNavigation.SceneMap({
        weather: WeatherPage,
        maps: MapsScreen,
        schedule: ScheduleScreen,
        classroom: RoomsScreen,
        more: MoreNavigator
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
