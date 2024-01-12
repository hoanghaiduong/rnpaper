import * as React from "react";

import { CombinedDefaultTheme, CombinedDarkTheme } from "./utils/themes";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createDrawerNavigator } from "@react-navigation/drawer";
import {
  InitialState,
  NavigationContainer,
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { useKeepAwake } from "expo-keep-awake";
import {
  PaperProvider,
  MD3DarkTheme,
  MD3LightTheme,
  MD2DarkTheme,
  MD2LightTheme,
  configureFonts,
} from "react-native-paper";
import { SafeAreaInsetsContext } from "react-native-safe-area-context";

import DrawerItems from "./src/DrawerItems";
import { I18nManager } from "react-native";
import { deviceColorsSupported } from "./utils";
import { useMaterial3Theme } from "@pchmn/expo-material3-theme";
import * as Updates from 'expo-updates';
import { PERSISTENCE_KEY, PREFERENCES_KEY, PreferencesContext } from "./src/contexts/ThemeContext";
import DevicesScreen from "./src/Screens/DevicesScreen";
import UsersScreen from "./src/Screens/UsersScreen";
import { DrawerParamList } from "./src/navigation/DrawerParamList";
import MainStack from "./src/RootNavigator";



const Drawer = createDrawerNavigator<DrawerParamList>();

export default function App() {
  useKeepAwake();

  const [fontsLoaded] = useFonts({
    Abel: require("./assets/fonts/Abel-Regular.ttf"),
  });

  const [isReady, setIsReady] = React.useState(false);
  const [initialState, setInitialState] = React.useState<
    InitialState | undefined
  >();

  const [isDarkMode, setIsDarkMode] = React.useState(false);
  const [themeVersion, setThemeVersion] = React.useState<2 | 3>(3);
  const [collapsed, setCollapsed] = React.useState(false);
  const [customFontLoaded, setCustomFont] = React.useState(false);
  const [rippleEffectEnabled, setRippleEffectEnabled] = React.useState(true);
  const [shouldUseDeviceColors, setShouldUseDeviceColors] =
    React.useState(true);
  const [rtl, setRtl] = React.useState<boolean>(
    I18nManager.getConstants().isRTL
  );
  const { theme: mdTheme } = useMaterial3Theme();
  const theme = React.useMemo(() => {
    if (themeVersion === 2) {
      return isDarkMode ? MD2DarkTheme : MD2LightTheme;
    }
    if (!deviceColorsSupported || !shouldUseDeviceColors) {
      return isDarkMode ? MD3DarkTheme : MD3LightTheme;
    }
    return isDarkMode
      ? { ...MD3DarkTheme, colors: mdTheme.dark }
      : { ...MD3LightTheme, colors: mdTheme.light };
  }, [isDarkMode, mdTheme, shouldUseDeviceColors, themeVersion]);


  React.useEffect(() => {
    const restoreState = async () => {
      try {
        const savedStateString = await AsyncStorage.getItem(PERSISTENCE_KEY);
        const state = JSON.parse(savedStateString || '');

        setInitialState(state);
      } catch (e) {
        // ignore error
      } finally {
        setIsReady(true);
      }
    };

    if (!isReady) {
      restoreState();
    }
  }, [isReady]);

  React.useEffect(() => {
    const restorePrefs = async () => {
      try {
        const prefString = await AsyncStorage.getItem(PREFERENCES_KEY);
        const preferences = JSON.parse(prefString || '');

        if (preferences) {
          setIsDarkMode(preferences.theme === 'dark');
          if (typeof preferences.rtl === 'boolean') {
            setRtl(preferences.rtl);
          }
          // Parse the 'collapsed' value from string to boolean
          if (typeof preferences.collapsed === 'boolean') {
            console.log('collapsed', preferences.collapsed)
            setCollapsed(preferences.collapsed);
          }
        }
      } catch (e) {
        // ignore error
      }
    };

    restorePrefs();
  }, []);

  React.useEffect(() => {
    const savePrefs = async () => {
      try {
        await AsyncStorage.setItem(
          PREFERENCES_KEY,
          JSON.stringify({
            theme: isDarkMode ? 'dark' : 'light',
            collapsed,
            rtl,
          })
        );
      } catch (e) {
        // ignore error
      }

      if (I18nManager.getConstants().isRTL !== rtl) {
        I18nManager.forceRTL(rtl);
        Updates.reloadAsync();
      }
    };

    savePrefs();
  }, [rtl, isDarkMode, collapsed]);

  const preferences = React.useMemo(
    () => ({
      toggleRtl: () => setRtl((rtl) => !rtl),
      toggleShouldUseDeviceColors: () =>
        setShouldUseDeviceColors((oldValue) => !oldValue),
      toggleTheme: () => setIsDarkMode((oldValue) => !oldValue),
      toggleCollapsed: () => setCollapsed(!collapsed),
      toggleCustomFont: () => setCustomFont(!customFontLoaded),
      toggleRippleEffect: () => setRippleEffectEnabled(!rippleEffectEnabled),
      toggleThemeVersion: () => {
        setCustomFont(false);
        setCollapsed(false);
        setThemeVersion((oldThemeVersion) => (oldThemeVersion === 2 ? 3 : 2));
        setRippleEffectEnabled(true);
      },
      customFontLoaded,
      rippleEffectEnabled,
      collapsed,
      theme,
      shouldUseDeviceColors,
      rtl
    }),
    [
      rtl,
      theme,
      collapsed,
      customFontLoaded,
      shouldUseDeviceColors,
      rippleEffectEnabled,
    ]
  );

  if (!isReady && !fontsLoaded) {
    return null;
  }




  const combinedTheme = isDarkMode ? CombinedDarkTheme : CombinedDefaultTheme;
  const configuredFontTheme = {
    ...combinedTheme,
    fonts: configureFonts({
      config: {
        fontFamily: "Abel",
      },
    }),
  };

  return (
    <PaperProvider
      settings={{ rippleEffectEnabled: preferences.rippleEffectEnabled }}
      theme={customFontLoaded ? configuredFontTheme : theme}
    >
      <PreferencesContext.Provider value={preferences}>
        <React.Fragment>
          <NavigationContainer
            theme={combinedTheme}
            initialState={initialState}
            onStateChange={(state) =>
              AsyncStorage.setItem(PERSISTENCE_KEY, JSON.stringify(state))
            }
          >
            <MainStack />

          </NavigationContainer>
        </React.Fragment>
      </PreferencesContext.Provider>
    </PaperProvider>
  );
}
