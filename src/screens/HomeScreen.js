import React, { useState } from 'react';

import {
  View,
  Text,
  Pressable,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';

import MahasiswaScreen from './MahasiswaScreen';
import AccountScreen from './AccountScreen';

// Ikon navigasi tanpa SVG
function TabIcon({ type, active }) {
  const iconColor = active ? '#702449' : '#A99AA6';

  if (type === 'mahasiswa') {
    return (
      <View style={styles.listIcon}>
        <View style={styles.iconRow}>
          <View style={[styles.iconDot, { backgroundColor: iconColor }]} />
          <View style={[styles.iconLine, { backgroundColor: iconColor }]} />
        </View>

        <View style={styles.iconRow}>
          <View style={[styles.iconDot, { backgroundColor: iconColor }]} />
          <View style={[styles.iconLine, { backgroundColor: iconColor }]} />
        </View>

        <View style={styles.iconRow}>
          <View style={[styles.iconDot, { backgroundColor: iconColor }]} />
          <View style={[styles.iconLine, { backgroundColor: iconColor }]} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.userIcon}>
      <View
        style={[
          styles.userHead,
          { backgroundColor: iconColor },
        ]}
      />

      <View
        style={[
          styles.userBody,
          { backgroundColor: iconColor },
        ]}
      />
    </View>
  );
}

export default function HomeScreen() {
  const [activeTab, setActiveTab] = useState('mahasiswa');

  const isMahasiswa = activeTab === 'mahasiswa';

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        backgroundColor="#F4EDF3"
        barStyle="dark-content"
      />

      {/* Page Content */}
      <View style={styles.screenContent}>
        {isMahasiswa ? (
          <MahasiswaScreen />
        ) : (
          <AccountScreen />
        )}
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        {/* Daftar Mahasiswa - Kiri */}
        <Pressable
          style={({ pressed }) => [
            styles.tabButton,
            pressed && styles.tabPressed,
          ]}
          onPress={() => setActiveTab('mahasiswa')}
          accessibilityRole="tab"
          accessibilityState={{
            selected: isMahasiswa,
          }}
        >
          {isMahasiswa ? (
            <View style={styles.activeIndicator} />
          ) : null}

          <TabIcon
            type="mahasiswa"
            active={isMahasiswa}
          />

          <Text
            style={[
              styles.tabLabel,
              isMahasiswa && styles.activeTabLabel,
            ]}
          >
            Daftar Mahasiswa
          </Text>
        </Pressable>

        {/* Akun - Kanan */}
        <Pressable
          style={({ pressed }) => [
            styles.tabButton,
            pressed && styles.tabPressed,
          ]}
          onPress={() => setActiveTab('akun')}
          accessibilityRole="tab"
          accessibilityState={{
            selected: !isMahasiswa,
          }}
        >
          {!isMahasiswa ? (
            <View style={styles.activeIndicator} />
          ) : null}

          <TabIcon
            type="akun"
            active={!isMahasiswa}
          />

          <Text
            style={[
              styles.tabLabel,
              !isMahasiswa && styles.activeTabLabel,
            ]}
          >
            Akun
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4EDF3',
  },

  screenContent: {
    flex: 1,
    overflow: 'hidden',
  },

  // Bottom Navigation
  bottomNav: {
    height: 68,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#EDE3EB',
    paddingHorizontal: 12,
    elevation: 12,
  },

  tabButton: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
    position: 'relative',
  },

  tabPressed: {
    opacity: 0.7,
  },

  activeIndicator: {
    position: 'absolute',
    top: 0,
    width: 43,
    height: 3,
    backgroundColor: '#702449',
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
  },

  tabLabel: {
    color: '#A99AA6',
    fontFamily: 'Poppins_500Medium',
    fontSize: 10,
  },

  activeTabLabel: {
    color: '#702449',
    fontFamily: 'Poppins_600SemiBold',
  },

  // Mahasiswa Icon
  listIcon: {
    width: 23,
    height: 21,
    justifyContent: 'space-between',
    paddingVertical: 2,
  },

  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },

  iconDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },

  iconLine: {
    width: 14,
    height: 2,
    borderRadius: 2,
  },

  // Account Icon
  userIcon: {
    width: 24,
    height: 23,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 3,
  },

  userHead: {
    width: 9,
    height: 9,
    borderRadius: 5,
  },

  userBody: {
    width: 19,
    height: 9,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
  },
});