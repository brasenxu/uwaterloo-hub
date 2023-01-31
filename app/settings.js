import { createContext } from "react";
import { MD3DarkTheme } from "react-native-paper";

import { Default } from "./config/themes";


export const Settings = createContext({

    theme: { ...MD3DarkTheme, colors: Default },
    setTheme: () => {},
    timeFormat: "ISO 8691",
    setTimeFormat: () => {}

})