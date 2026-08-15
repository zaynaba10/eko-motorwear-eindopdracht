import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HapticTab } from '@/components/haptic-tab';
import { EkoColors } from '@/constants/eko-theme';

/**
 * Zwevende tabbalk met alleen iconen. Het actieve icoon staat in een gevuld rondje,
 * naar het voorbeeld uit de referentie, in de EKO-huisstijl.
 */

const BALK_HOOGTE = 62;

function TabIcoon({
  naam,
  focused,
}: {
  naam: keyof typeof Ionicons.glyphMap;
  focused: boolean;
}) {
  return (
    <View style={[styles.icoon, focused && styles.icoonAan]}>
      <Ionicons
        name={naam}
        size={22}
        color={focused ? EkoColors.white : EkoColors.primaryDark}
      />
    </View>
  );
}

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const onder = Math.max(insets.bottom, 12);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarButton: HapticTab,
        sceneStyle: { backgroundColor: EkoColors.white, paddingBottom: BALK_HOOGTE + onder + 8 },
        tabBarStyle: {
          position: 'absolute',
          left: 16,
          right: 16,
          bottom: onder,
          height: BALK_HOOGTE,
          borderRadius: 31,
          borderTopWidth: 0,
          backgroundColor: EkoColors.white,
          shadowColor: EkoColors.primaryDark,
          shadowOpacity: 0.12,
          shadowRadius: 16,
          shadowOffset: { width: 0, height: 6 },
          elevation: 8,
        },
        tabBarItemStyle: { height: BALK_HOOGTE },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => <TabIcoon naam="home-outline" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Shop',
          tabBarIcon: ({ focused }) => <TabIcoon naam="bag-handle-outline" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="blog"
        options={{
          title: 'Blog',
          tabBarIcon: ({ focused }) => <TabIcoon naam="newspaper-outline" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: 'Account',
          tabBarIcon: ({ focused }) => <TabIcoon naam="person-outline" focused={focused} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  icoon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icoonAan: { backgroundColor: EkoColors.primaryDark },
});
