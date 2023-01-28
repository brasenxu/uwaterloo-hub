import { createContext } from "react";

import { themes } from "./config/themes";


export const Settings = createContext({

    theme: themes.default,
    setTheme: () => {},
    timeFormat: "ISO 8691",
    setTimeFormat: () => {}

})