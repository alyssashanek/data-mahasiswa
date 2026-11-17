import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  StatusBar,
} from 'react-native';

import Svg, { Path } from 'react-native-svg';

import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins';

import { loginWithGoogle } from '../services/authService';

// Google Logo
function GoogleLogo() {
  return (
    <Svg width={23} height={23} viewBox="0 0 48 48">
      <Path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
      />

      <Path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.74 7.18l7.66 5.95c4.48-4.14 7.12-10.25 7.12-17.6z"
      />

      <Path
        fill="#FBBC05"
        d="M10.53 28.59A14.4 14.4 0 0 1 9.75 24c0-1.59.27-3.13.76-4.59l-7.98-6.19A23.9 23.9 0 0 0 0 24c0 3.87.93 7.52 2.56 10.78l7.97-6.19z"
      />

      <Path
        fill="#34A853"
        d="M24 48c6.48 0 11.93-2.13 15.91-5.81l-7.66-5.95c-2.13 1.43-4.89 2.27-8.25 2.27-6.26 0-11.57-4.22-13.47-9.91l-7.97 6.19C6.51 42.62 14.62 48 24 48z"
      />
    </Svg>
  );
}

export default function LoginScreen() {
  const [loading, setLoading] = useState(false);

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  const handleLogin = async () => {
    try {
      setLoading(true);
      await loginWithGoogle();
    } catch (error) {
      console.log('Login error:', error);

      Alert.alert(
        'Login Gagal',
        error.message || 'Terjadi kesalahan saat login.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Tunggu sampai font selesai dimuat
  if (!fontsLoaded) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <StatusBar
          barStyle="light-content"
          backgroundColor="#48142F"
        />
        <ActivityIndicator size="large" color="#FFFFFF" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#48142F"
      />

      {/* Burgundy Header */}
      <View style={styles.hero}>
        <View style={styles.decorCircle} />
        <View style={styles.decorCircleSmall} />

        <View style={styles.heroText}>
          <Text style={styles.eyebrow}>
            WELCOME TO YOUR CAMPUS SPACE
          </Text>

          <Text style={styles.title}>
            Semua data,{' \n'}
            <Text style={styles.titleAccent}>
              lebih terorganisir.
            </Text>
          </Text>

          <Text style={styles.subtitle}>
            Akses informasi mahasiswa dengan mudah
            dalam satu aplikasi.
          </Text>
        </View>
      </View>

      {/* Login Panel */}
      <View style={styles.loginSection}>
        <View style={styles.loginContent}>
          <Text style={styles.loginTitle}>
            Selamat datang!
          </Text>

          <Text style={styles.loginDescription}>
            Masuk menggunakan akun Google untuk
            melanjutkan ke halaman utama.
          </Text>

          {/* Google Sign In Button */}
          <Pressable
            style={({ pressed }) => [
              styles.loginButton,
              pressed && styles.buttonPressed,
              loading && styles.buttonDisabled,
            ]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <View style={styles.googleIconContainer}>
                  <GoogleLogo />
                </View>

                <Text style={styles.buttonText}>
                  Continue with Google
                </Text>

                <Text style={styles.buttonArrow}>
                  ›
                </Text>
              </>
            )}
          </Pressable>

          {/* Security Information */}
          <View style={styles.securityNote}>
            <Text style={styles.securityText}>
              Your account is protected and secure
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: '#48142F',
    justifyContent: 'center',
    alignItems: 'center',
  },

  container: {
    flex: 1,
    backgroundColor: '#48142F',
  },

  // Burgundy Header
  hero: {
    flex: 0.9,
    backgroundColor: '#48142F',
    paddingHorizontal: 27,
    paddingTop: 30,
    paddingBottom: 45,
    overflow: 'hidden',
  },

  decorCircle: {
    position: 'absolute',
    width: 270,
    height: 270,
    borderRadius: 135,
    backgroundColor: '#70294D',
    opacity: 0.35,
    right: -120,
    top: 90,
  },

  decorCircleSmall: {
    position: 'absolute',
    width: 125,
    height: 125,
    borderRadius: 63,
    letterSpacing: 1.5,
    marginBottom: 13,
  },

  title: {
    color: '#FFFFFF',
    fontFamily: 'Poppins_700Bold',
    fontSize: 29,
    lineHeight: 40,
  },

  titleAccent: {
    color: '#E9C7DB',
    fontFamily: 'Poppins_600SemiBold',
  },

  subtitle: {
    color: '#E2CEDA',
    fontFamily: 'Poppins_400Regular',
    fontSize: 12,
    lineHeight: 21,
    marginTop: 13,
    maxWidth: 290,
  },

  // Rounded Login Panel
  loginSection: {
    flex: 1.1,
    backgroundColor: '#F4EDF3',
    marginTop: -28,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 27,
    paddingTop: 40,
    paddingBottom: 30,
    elevation: 10,
    zIndex: 2,
  },

  loginContent: {
    width: '100%',
  },

  loginTitle: {
    color: '#48142F',
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 23,
  },

  loginDescription: {
    color: '#847583',
    fontFamily: 'Poppins_400Regular',
    fontSize: 12,
    lineHeight: 21,
    marginTop: 9,
    marginBottom: 30,
  },

  // Google Button
  loginButton: {
    backgroundColor: '#702449',
    borderRadius: 16,
    minHeight: 58,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    elevation: 3,
  },

  buttonPressed: {
    opacity: 0.8,
  },

  buttonDisabled: {
    opacity: 0.7,
  },

  googleIconContainer: {
    position: 'absolute',
    left: 15,
    width: 35,
    height: 35,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  buttonText: {
    color: '#FFFFFF',
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 13,
    textAlign: 'center',
  },

  buttonArrow: {
    position: 'absolute',
    right: 18,
    color: '#FFFFFF',
    fontFamily: 'Poppins_400Regular',
    fontSize: 25,
  },

  // Security
  securityNote: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },

  securityText: {
    color: '#958594',
    fontFamily: 'Poppins_400Regular',
    fontSize: 11,
  },
});