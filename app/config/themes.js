const Default = {
    primary: "rgb(172, 199, 255)",
    onPrimary: "rgb(0, 47, 103)",
    primaryContainer: "rgb(8, 69, 142)",
    onPrimaryContainer: "rgb(215, 226, 255)",
    secondary: "rgb(190, 198, 220)",
    onSecondary: "rgb(40, 48, 65)",
    secondaryContainer: "rgb(68, 70, 78)",
    onSecondaryContainer: "rgb(225, 226, 235)",
    tertiary: "rgb(221, 188, 224)",
    onTertiary: "rgb(63, 40, 68)",
    tertiaryContainer: "rgb(87, 62, 91)",
    onTertiaryContainer: "rgb(251, 215, 252)",
    error: "rgb(255, 180, 171)",
    onError: "rgb(105, 0, 5)",
    errorContainer: "rgb(147, 0, 10)",
    onErrorContainer: "rgb(255, 180, 171)",
    background: "rgb(27, 27, 29)",
    onBackground: "rgb(227, 227, 227)",
    surface: "rgb(28, 28, 28)",
    onSurface: "rgb(227, 227, 227)",
    surfaceVariant: "rgb(68, 71, 78)",
    onSurfaceVariant: "rgb(196, 198, 208)",
    outline: "rgb(142, 144, 153)",
    outlineVariant: "rgb(68, 71, 78)",
    shadow: "rgb(0, 0, 0)",
    scrim: "rgb(0, 0, 0)",
    inverseSurface: "rgb(227, 227, 227)",
    inverseOnSurface: "rgb(47, 48, 51)",
    inversePrimary: "rgb(46, 93, 168)",
    elevation: {
        level0: "transparent",
        level1: "rgb(37, 37, 37)",
        level2: "rgb(42, 42, 42)",
        level3: "rgb(47, 47, 47)",
        level4: "rgb(50, 50, 50)",
        level5: "rgb(52, 52, 52)"
    },
    surfaceDisabled: "rgba(227, 227, 227, 0.12)",
    onSurfaceDisabled: "rgba(227, 227, 227, 0.38)",
    backdrop: "rgba(45, 48, 56, 0.4)"
};
const Waterloo = {
    ...Default,
    primary: "rgb(234, 195, 60)",
    background: "#26221a",
}
const Violet = {
    ...Default,
    primary: "#e9b67e",
    background: "#21212d",
    secondaryContainer: "#e9b67e",
    onSecondaryContainer: "#21212d"
}


export { Default, Waterloo, Violet };
