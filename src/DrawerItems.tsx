import * as React from 'react';
import { I18nManager, StyleSheet, View, Platform, Alert } from 'react-native';

import { DrawerContentScrollView, DrawerNavigationProp } from '@react-navigation/drawer';
import * as Updates from 'expo-updates';
import {
  Badge,
  Drawer,
  MD2Colors,
  MD3Colors,
  Switch,
  Text,
  TouchableRipple,
} from 'react-native-paper';

import { deviceColorsSupported, isWeb } from '../utils';

import { PreferencesContext } from './contexts/ThemeContext';
import { useExampleTheme } from '../utils/themes';
import { NavigationAction, NavigationHelpers, NavigationProp, useNavigation, useRoute } from '@react-navigation/native';
import { DrawerParamList } from './navigation/DrawerParamList';
import { StackParamList } from './navigation/StackParamList';
import { StackNavigationProp } from '@react-navigation/stack';

const DrawerItemsData = [
  {
    label: 'Trang Chủ',
    icon: 'inbox',
    key: 0,
    name: 'Home',

  },
  {
    label: 'Thiết Bị',
    icon: 'star',
    key: 1,
    name: 'Devices',

  },
  { label: 'Người Dùng', icon: 'send', key: 2, name: "Users" },

];

const DrawerCollapsedItemsData = [
  {
    label: 'Trang chủ',
    focusedIcon: 'inbox',
    unfocusedIcon: 'inbox-outline',
    key: 0,
    badge: 44,
    name: "Root"
  },
  {
    label: 'Thiết Bị',
    focusedIcon: 'star',
    unfocusedIcon: 'star-outline',
    key: 1,
    name: 'Devices',
  },
  {
    label: 'Người Dùng',
    focusedIcon: 'send',
    unfocusedIcon: 'send-outline',
    key: 2,
    name: "Users"
  },
  {
    label: 'Full width',
    focusedIcon: 'arrow-all',
    key: 4,
  },

];

function DrawerItems({ }) {
  const navigation = useNavigation<NavigationProp<any>>()
  const route = useRoute()

  const [drawerItemIndex, setDrawerItemIndex] = React.useState<number>(0);
  const preferences = React.useContext(PreferencesContext);

  const _setDrawerItem = (index: number) => setDrawerItemIndex(index);

  const { isV3, colors } = useExampleTheme();
  const isIOS = Platform.OS === 'ios';

  if (!preferences) throw new Error('PreferencesContext not provided');
  const {
    toggleShouldUseDeviceColors,
    toggleTheme,
    toggleRtl: toggleRTL,
    toggleThemeVersion,
    toggleCollapsed,
    toggleCustomFont,
    toggleRippleEffect,
    customFontLoaded,
    rippleEffectEnabled,
    collapsed,
    rtl: isRTL,
    theme: { dark: isDarkTheme },
    shouldUseDeviceColors,
  } = preferences;

  const _handleToggleRTL = () => {
    toggleRTL();
    I18nManager.forceRTL(!isRTL);
    if (isWeb) {
      Updates.reloadAsync();
    }
  };

  const coloredLabelTheme = {
    colors: isV3
      ? {
        secondaryContainer: MD3Colors.tertiary80,
        onSecondaryContainer: MD3Colors.tertiary20,
      }
      : {
        primary: MD2Colors.tealA200,
      },
  };

  return (
    <DrawerContentScrollView
      alwaysBounceVertical={false}
      style={[
        styles.drawerContent,
        {
          backgroundColor: colors.surface,
        },
      ]}
    >
      {isV3 && collapsed && (
        <Drawer.Section style={styles.collapsedSection}>
          {DrawerCollapsedItemsData.map((props, index) => (
            <Drawer.CollapsedItem
              {...props}
              key={props.key}
              active={drawerItemIndex === index || props.name === route.name}
              onPress={() => {
                _setDrawerItem(index);
                props.key === 4 && toggleCollapsed();
              }}
            />
          ))}
        </Drawer.Section>
      )}
      {!collapsed && (
        <>
          <Drawer.Section title="CÔNG TY TINH 1 TV">
            {DrawerItemsData.map((props, index) => (
              <Drawer.Item
                {...props}
                key={props.key}
                theme={props.key === 3 ? coloredLabelTheme : undefined}
                active={drawerItemIndex === index || props.name === route.name}
                onPress={() => {
                  _setDrawerItem(index)
                  navigation.navigate(props.name)
                }}
              />
            ))}
          </Drawer.Section>

          <Drawer.Section title="Preferences">
            <TouchableRipple onPress={toggleTheme}>
              <View style={[styles.preference, isV3 && styles.v3Preference]}>
                <Text variant="labelLarge">Dark Theme</Text>
                <View pointerEvents="none">
                  <Switch value={isDarkTheme} />
                </View>
              </View>
            </TouchableRipple>

            {!isWeb && (
              <TouchableRipple onPress={_handleToggleRTL}>
                <View style={[styles.preference, isV3 && styles.v3Preference]}>
                  <Text variant="labelLarge">RTL</Text>
                  <View pointerEvents="none">
                    <Switch value={isRTL} />
                  </View>
                </View>
              </TouchableRipple>
            )}

            <TouchableRipple onPress={toggleThemeVersion}>
              <View style={[styles.preference, isV3 && styles.v3Preference]}>
                <Text variant="labelLarge">MD 2</Text>
                <View pointerEvents="none">
                  <Switch value={!isV3} />
                </View>
              </View>
            </TouchableRipple>

            {isV3 && (
              <TouchableRipple onPress={toggleCollapsed}>
                <View style={[styles.preference, isV3 && styles.v3Preference]}>
                  <Text variant="labelLarge">Collapsed drawer *</Text>
                  <View pointerEvents="none">
                    <Switch value={collapsed} />
                  </View>
                </View>
              </TouchableRipple>
            )}

            {isV3 && (
              <TouchableRipple onPress={toggleCustomFont}>
                <View style={[styles.preference, isV3 && styles.v3Preference]}>
                  <Text variant="labelLarge">Custom font *</Text>
                  <View pointerEvents="none">
                    <Switch value={customFontLoaded} />
                  </View>
                </View>
              </TouchableRipple>
            )}

            <TouchableRipple onPress={toggleRippleEffect}>
              <View style={[styles.preference, isV3 && styles.v3Preference]}>
                <Text variant="labelLarge">
                  {isIOS ? 'Highlight' : 'Ripple'} effect *
                </Text>
                <View pointerEvents="none">
                  <Switch value={rippleEffectEnabled} />
                </View>
              </View>
            </TouchableRipple>
          </Drawer.Section>
          {isV3 && !collapsed && (
            <Text variant="bodySmall" style={styles.annotation}>
              * - available only for MD3
            </Text>
          )}
        </>
      )}
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,

  },
  preference: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,

  },
  v3Preference: {
    height: 56,
    paddingHorizontal: 28,
  },
  badge: {
    alignSelf: 'center',
  },
  collapsedSection: {
    marginTop: 16,

  },
  annotation: {
    marginHorizontal: 24,
    marginVertical: 6,
  },
});
export default DrawerItems;
