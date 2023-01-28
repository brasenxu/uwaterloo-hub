import React, { useState } from "react";
import { MD3DarkTheme, Provider as PaperProvider } from "react-native-paper";

import Navigator from "./app/Navigator";
import { StatusBar } from "react-native";
import { themes } from "./app/config/themes";
import { Settings } from "./app/settings";
import colors from "./app/config/colors";


function App() {

    console.log("Restarted App");
    StatusBar.setBarStyle("light-content");

    const [theme, setTheme] = useState({ ...MD3DarkTheme, colors });
    const [timeFormat, setTimeFormat] = useState("ISO 8601");

    return (
        <PaperProvider theme={theme}>
            <Settings.Provider value={{ theme, setTheme, timeFormat, setTimeFormat }}>
                <Navigator />
            </Settings.Provider>
        </PaperProvider>
    );

}


export default App;
