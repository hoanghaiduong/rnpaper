import { StyleSheet, View } from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { CommonActions } from '@react-navigation/native';
import { Text, BottomNavigation } from 'react-native-paper';
import LoginScreen from '../Screens/LoginScreen';

const Tab = createBottomTabNavigator();
function HomeScreen() {
    return (
        <View style={styles.container}>
            <Text variant="headlineMedium">Home!</Text>
        </View>
    );
}

function SettingsScreen() {
    return (
        <View style={styles.container}>
            <Text variant="headlineMedium">Settings!</Text>
        </View>
    );
}
const TabsNavigator = () => {
    return (
        <Tab.Navigator
            initialRouteName='Test'
            screenOptions={{
                headerShown: false,
            }}
            tabBar={({ navigation, state, descriptors, insets }) => (
                <BottomNavigation.Bar
                    navigationState={state}
                    safeAreaInsets={insets}
                    onTabPress={({ route, preventDefault }) => {
                        const event = navigation.emit({
                            type: 'tabPress',
                            target: route.key,
                            canPreventDefault: true,
                        });

                        if (event.defaultPrevented) {
                            preventDefault();
                        } else {
                            navigation.dispatch({
                                ...CommonActions.navigate(route.name, route.params),
                                target: state.key,
                            });
                        }
                    }}
                    renderIcon={({ route, focused, color }) =>
                        descriptors[route.key].options.tabBarIcon?.({
                            focused,
                            color,
                            size: 24,
                        }) || null
                    }
                    getLabelText={({ route }) => descriptors[route.key].route.name}
                />
            )}
        >
            <Tab.Screen
                name="Test"
                component={LoginScreen}
                options={{
                    tabBarIcon: ({ color, size }) => {
                        return <Icon name="home" size={size} color={color} />;
                    },
                }}
            />
            <Tab.Screen
                name="Settings"
                component={SettingsScreen}
                options={{
                    tabBarIcon: ({ color, size }) => {
                        return <Icon name="cog" size={size} color={color} />;
                    },
                }}
            />
        </Tab.Navigator>
    );
}

export default TabsNavigator

TabsNavigator.title = 'Material Bottom Tab Navigator';


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
