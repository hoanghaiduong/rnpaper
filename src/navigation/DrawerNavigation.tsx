
import React, { useEffect, useState } from "react";
import { createDrawerNavigator, DrawerContentComponentProps, DrawerNavigationProp } from "@react-navigation/drawer";

import { SafeAreaInsetsContext } from "react-native-safe-area-context";
import DrawerItems from "../DrawerItems";
import { DrawerParamList } from "./DrawerParamList";

import HomeScreen from "../Screens/HomeScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { PERSISTENCE_KEY, PREFERENCES_KEY, PreferencesContext } from "../contexts/ThemeContext";

type DrawerNavigationProps = {
    collapsed: boolean;
};

const Drawer = createDrawerNavigator<DrawerParamList>();

const DrawerNavigation: React.FC<DrawerNavigationProps> = () => {
    const preferences = React.useContext(PreferencesContext);
    if (!preferences) throw new Error('PreferencesContext not provided');
    const {

        collapsed,

    } = preferences;
    return (
        <SafeAreaInsetsContext.Consumer>
            {(insets) => {
                const { left, right } = insets || { left: 0, right: 0 };
                const collapsedDrawerWidth = 80 + Math.max(left, right);
                return (

                    <Drawer.Navigator
                        initialRouteName="Home"
                        screenOptions={{
                            drawerStyle: collapsed && {
                                width: collapsedDrawerWidth,
                            },
                        }}
                        drawerContent={() => <DrawerItems />}
                    >
                        <Drawer.Screen
                            name="Home"
                            component={HomeScreen}
                            options={{
                                headerShown: true,
                            }}
                        />


                    </Drawer.Navigator>


                );
            }}
        </SafeAreaInsetsContext.Consumer>
    );
};

export default DrawerNavigation;
