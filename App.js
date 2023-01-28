import React from "react";
import { MD3DarkTheme, Provider } from "react-native-paper";

import Navigator from "./app/Navigator";
import { StatusBar } from "react-native";
import colors from "./app/config/colors";


const theme = { ...MD3DarkTheme, colors }

function App() {

    console.log("Restarted App")

    StatusBar.setBarStyle("light-content")

    return (
        <Provider theme={theme}>
            <Navigator/>
        </Provider>
    );

}

export default App;
