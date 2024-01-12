import React from "react";
import { MD2Theme, MD3Theme } from "react-native-paper";

export const PERSISTENCE_KEY = "NAVIGATION_STATE";
export const PREFERENCES_KEY = "APP_PREFERENCES";

export const PreferencesContext = React.createContext<{
  toggleShouldUseDeviceColors?: () => void;
  toggleRtl: () => void;
  toggleTheme: () => void;
  toggleThemeVersion: () => void;
  toggleCollapsed: () => void;
  toggleCustomFont: () => void;
  toggleRippleEffect: () => void;
  customFontLoaded: boolean;
  rippleEffectEnabled: boolean;
  collapsed: boolean;
  theme: MD2Theme | MD3Theme;
  shouldUseDeviceColors?: boolean;
  rtl: boolean;

} | null>(null);