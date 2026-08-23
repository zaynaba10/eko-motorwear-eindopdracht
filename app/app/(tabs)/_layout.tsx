import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HapticTab } from '@/components/haptic-tab';
import { EkoColors, EkoFonts } from '@/constants/eko-theme';
import { useVerlanglijst } from '@/lib/verlanglijst';
import { useWinkelmand } from '@/lib/winkelmand';

/**
 * Zwevende tabbalk met vijf iconen: home, zoeken, verlanglijst, winkelmand en
 * profiel. Het actieve icoon staat in een gevuld rondje; verlanglijst en
 * winkelmand tonen een telbolletje. Blog is geen apart tabblad meer — die staat
 * op het startscherm in de sectie Inspiratie.
 */

const BALK_HOOGTE = 62;

function TabIcoon({
  naam,
  focused,
  aantal,
}: {
  naam: keyof typeof Ionicons.glyphMap;
  focused: boolean;
  aantal?: number;
}) {
  return (
    <View style={[styles.icoon, focused && styles.icoonAan]}>
      <Ionicons
        name={naam}
        size={22}
        color={focused ? EkoColors.white : EkoColors.primaryDark}
      />
      {!!aantal && aantal > 0 && (
        <View style={styles.bolletje}>
          <Text style={styles.bolletjeTekst}>{aantal > 99 ? '99+' : aantal}</Text>
        </View>
      )}
    </View>
  );
}

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const onder = Math.max(insets.bottom, 12);

  const verlanglijst = useVerlanglijst();
  const mand = useWinkelmand();
  const mandAantal = mand.reduce((som, i) => som + i.aantal, 0);

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
          title: 'Zoeken',
          tabBarIcon: ({ focused }) => <TabIcoon naam="search-outline" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="verlanglijst"
        options={{
          title: 'Verlanglijst',
          tabBarIcon: ({ focused }) => (
            <TabIcoon naam="heart-outline" focused={focused} aantal={verlanglijst.length} />
          ),
        }}
      />
      <Tabs.Screen
        name="winkelmand"
        options={{
          title: 'Winkelmand',
          tabBarIcon: ({ focused }) => (
            <TabIcoon naam="bag-handle-outline" focused={focused} aantal={mandAantal} />
          ),
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: 'Profiel',
          tabBarIcon: ({ focused }) => <TabIcoon naam="person-outline" focused={focused} />,
        }}
      />

      {/* Blog blijft bereikbaar via Inspiratie op het startscherm, maar krijgt geen tabblad. */}
      <Tabs.Screen name="blog" options={{ href: null }} />

      {/* Winkelschermen zonder eigen tabblad: ze staan bewust ín de tabgroep,
          zodat de tabbalk tijdens het winkelen altijd zichtbaar blijft. */}
      <Tabs.Screen name="categorie/[slug]" options={{ href: null }} />
      <Tabs.Screen name="lijst/[slug]" options={{ href: null }} />
      <Tabs.Screen name="product/[id]" options={{ href: null }} />
      <Tabs.Screen name="zoeken/[term]" options={{ href: null }} />
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
  bolletje: {
    position: 'absolute',
    top: -1,
    right: -6,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    paddingHorizontal: 5,
    backgroundColor: EkoColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bolletjeTekst: {
    fontFamily: EkoFonts.bodyBold,
    fontSize: 11,
    color: EkoColors.white,
  },
});
