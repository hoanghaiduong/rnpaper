// themes.js
import { MD2Theme, MD3DarkTheme, MD3LightTheme, MD3Theme, adaptNavigationTheme, useTheme } from "react-native-paper";

import {
    DarkTheme as NavigationDarkTheme,
    DefaultTheme as NavigationDefaultTheme,
} from "@react-navigation/native";
const { LightTheme, DarkTheme } = adaptNavigationTheme({
    reactNavigationLight: NavigationDefaultTheme,
    reactNavigationDark: NavigationDarkTheme,
});
export const useExampleTheme = () => useTheme<MD2Theme | MD3Theme>();

const CombinedDefaultTheme = {
    ...MD3LightTheme,
    ...LightTheme,
    colors: {
        ...MD3LightTheme.colors,
        ...LightTheme.colors,
    },
};

const CombinedDarkTheme = {
    ...MD3DarkTheme,
    ...DarkTheme,
    colors: {
        ...MD3DarkTheme.colors,
        ...DarkTheme.colors,
    },
};

export { CombinedDefaultTheme, CombinedDarkTheme };
