import * as React from 'react';
import { Platform } from 'react-native';

import type { DrawerNavigationProp } from '@react-navigation/drawer';
import { getHeaderTitle } from '@react-navigation/elements';
import {
    CardStyleInterpolators,
    createStackNavigator,
} from '@react-navigation/stack';
import { Appbar } from 'react-native-paper';

import DrawerNavigation from './navigation/DrawerNavigation';
import TabsNavigator from './navigation/TabsNavigator';
import OnBoardingScreen from './Screens/OnBoardingScreen';
import LoginScreen from './Screens/LoginScreen';
import SignUpScreen from './Screens/SignUpScreen';
import UserDetailScreen from './Screens/UserDetailScreen';
import UsersScreen from './Screens/UsersScreen';
import DevicesScreen from './Screens/DevicesScreen';
import { StackParamList } from './navigation/StackParamList';
import DeviceDetail from './Screens/DeviceDetail';

const Stack = createStackNavigator<StackParamList>();

export default function MainStack() {
    const cardStyleInterpolator =
        Platform.OS === 'android'
            ? CardStyleInterpolators.forFadeFromBottomAndroid
            : CardStyleInterpolators.forHorizontalIOS;
    return (
        <Stack.Navigator
            initialRouteName='Onboarding'
            screenOptions={({ navigation }) => {
                return {
                    detachPreviousScreen: !navigation.isFocused(),
                    cardStyleInterpolator,
                    header: ({ navigation, route, options, back }) => {
                        const title = getHeaderTitle(options, route.name);
                        return (
                            <Appbar.Header elevated>
                                {back ? (
                                    <Appbar.BackAction onPress={() => navigation.goBack()} />
                                ) : (navigation as any).openDrawer ? (
                                    <Appbar.Action
                                        icon="menu"
                                        isLeading
                                        onPress={() =>
                                            (
                                                navigation as any as DrawerNavigationProp<{}>
                                            ).openDrawer()
                                        }
                                    />
                                ) : null}
                                <Appbar.Content title={title} />
                            </Appbar.Header>
                        );
                    },
                };
            }}
        >
            <Stack.Screen
                name="Root"
                component={DrawerNavigation}
                options={{
                    title: 'Trang Chủ',
                    gestureEnabled: false,
                    headerShown: false
                }}
            />
            <Stack.Screen
                name="SignIn"
                component={LoginScreen}
                options={{
                    title: 'Đăng Nhập',
                    gestureEnabled: false,
                    headerShown: false
                }}
            />
            <Stack.Screen
                name="SignUp"
                component={SignUpScreen}
                options={{
                    title: 'Đăng Ký',
                    gestureEnabled: false,
                    headerShown: false
                }}
            />
            <Stack.Screen
                name='Onboarding'
                component={OnBoardingScreen}
                options={{
                    gestureEnabled: false,
                    headerShown: false
                }}
            />
            <Stack.Screen
                name="Devices"
                component={DevicesScreen}
            />
            <Stack.Screen
                name="DeviceDetail"
                component={DeviceDetail}
            />
            <Stack.Screen
                name="Users"
                component={UsersScreen}
            />
            <Stack.Screen
                name="UserDetail"
                component={UserDetailScreen}
            />
            <Stack.Screen
                name='TestTab'
                component={TabsNavigator}
                options={{
                    gestureEnabled: false,
                    headerShown: true
                }}
            />
            {/* <Stack.Screen
                name="Devices"
                component={DevicesScreen}
                options={{
                    title: 'Thiết Bị',
                    gestureEnabled: false,
                    headerLeft: null, // Hide the back button
                }}
            />
            <Stack.Screen
                name="Users"
                component={UsersScreen}
                options={{
                    title: 'Người Dùng',
                    gestureEnabled: false,
                    headerLeft: null,
                }}
            /> */}
            {/* {(Object.keys(examples) as Array<keyof typeof examples>).map((id) => {
                return (
                    <Stack.Screen
                        navigationKey={id}
                        name={id}
                        component={examples[id]}
                        options={{
                            title: examples[id].title,
                            headerShown: id !== 'themingWithReactNavigation',
                        }}
                    />
                );
            })} */}
        </Stack.Navigator>
    );
}
