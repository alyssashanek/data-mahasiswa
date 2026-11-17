import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

import Svg, { Path } from 'react-native-svg';

import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins';

import {
  loginWithGoogle,
  loginWithEmailPassword,
} from '../services/authService';

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
  const [loadingMethod, setLoadingMethod] = useState('');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [formError, setFormError] = useState('');

  const passwordRef = useRef(null);

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  // Login Google
  const handleLogin = async () => {
    try {
      setLoading(true);
      setLoadingMethod('google');
      setFormError('');

      await loginWithGoogle();
    } catch (error) {
      console.log('Google Login Error:', error);

      setFormError(
        error.message || 'Terjadi kesalahan saat login menggunakan Google.'
      );
    } finally {
      setLoading(false);
      setLoadingMethod('');
    }
  };

  // Login Email dan Password
  const handleEmailLogin = async () => {
    const normalizedEmail = email.trim();

    setEmailError('');
    setPasswordError('');
    setFormError('');

    let isValid = true;

    if (!normalizedEmail) {
      setEmailError('Email wajib diisi.');
      isValid = false;
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)
    ) {
      setEmailError('Format email belum valid.');
      isValid = false;
    }

    if (!password) {
      setPasswordError('Password wajib diisi.');
      isValid = false;
    }

    if (!isValid) {
      setFormError('Periksa kembali data yang kamu masukkan.');
      return;
    }

    try {
      setLoading(true);
      setLoadingMethod('email');

      await loginWithEmailPassword(normalizedEmail, password);
    } catch (error) {
      console.log('Email Login Error:', error);

      let message = 'Terjadi kesalahan saat login.';

      if (
        error.code === 'auth/invalid-credential' ||
        error.code === 'auth/wrong-password' ||
        error.code === 'auth/user-not-found'
      ) {
        message = 'Email atau password yang kamu masukkan salah.';
      } else if (error.code === 'auth/invalid-email') {
        message = 'Format email tidak valid.';
      } else if (error.code === 'auth/too-many-requests') {
        message = 'Terlalu banyak percobaan. Coba lagi nanti.';
      } else if (error.code === 'auth/user-disabled') {
        message = 'Akun ini sedang dinonaktifkan.';
      } else if (error.code === 'auth/operation-not-allowed') {
        message = 'Login Email/Password belum diaktifkan.';
      } else if (error.code === 'auth/network-request-failed') {
        message = 'Periksa koneksi internet kamu.';
      } else {
        message = error.message || message;
      }

      setFormError(message);
    } finally {
      setLoading(false);
      setLoadingMethod('');
    }
  };

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

      <KeyboardAvoidingView
        style={styles.keyboardAvoiding}
        behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
        keyboardVerticalOffset={0}
      >
        {/* Burgundy Header */}
        <View style={styles.hero}>
          <View style={styles.decorCircle} />
          <View style={styles.decorCircleSmall} />

          <View style={styles.heroText}>
            <Text style={styles.eyebrow}>
              WELCOME TO YOUR CAMPUS SPACE
            </Text>

            <Text style={styles.title}>
              Semua data,{'\n'}
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

        {/* Floating Login Card */}
        <View style={styles.loginSection}>
          <ScrollView
            style={styles.loginScroll}
            contentContainerStyle={styles.loginContent}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.loginTitle}>
              Selamat datang!
            </Text>

            <Text style={styles.loginDescription}>
              Masuk menggunakan email dan password
              atau akun Google yang sudah terhubung.
            </Text>

            {/* Email */}
            <Text style={styles.inputLabel}>
              Email
            </Text>

            <TextInput
              style={[
                styles.textInput,
                emailError ? styles.inputError : null,
              ]}
              placeholder="Masukkan email"
              placeholderTextColor="#A99AA6"
              value={email}
              onChangeText={(value) => {
                setEmail(value);
                setEmailError('');
                setFormError('');
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!loading}
              returnKeyType="next"
              onSubmitEditing={() => passwordRef.current?.focus()}
            />

            {emailError ? (
              <Text style={styles.fieldError}>
                {emailError}
              </Text>
            ) : null}

            {/* Password */}
            <Text style={styles.inputLabel}>
              Password
            </Text>

            <TextInput
              ref={passwordRef}
              style={[
                styles.textInput,
                passwordError ? styles.inputError : null,
              ]}
              placeholder="Masukkan password"
              placeholderTextColor="#A99AA6"
              value={password}
              onChangeText={(value) => {
                setPassword(value);
                setPasswordError('');
                setFormError('');
              }}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              editable={!loading}
              returnKeyType="done"
              onSubmitEditing={handleEmailLogin}
            />

            {passwordError ? (
              <Text style={styles.fieldError}>
                {passwordError}
              </Text>
            ) : null}

            {/* Validation / Login Error */}
            {formError ? (
              <View style={styles.errorBox}>
                <View style={styles.errorIcon}>
                  <Text style={styles.errorIconText}>!</Text>
                </View>

                <Text style={styles.errorText}>
                  {formError}
                </Text>
              </View>
            ) : null}

            {/* Email Login */}
            <Pressable
              style={({ pressed }) => [
                styles.emailLoginButton,
                pressed && styles.buttonPressed,
                loading && styles.buttonDisabled,
              ]}
              onPress={handleEmailLogin}
              disabled={loading}
            >
              {loading && loadingMethod === 'email' ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.emailLoginButtonText}>
                  Sign In with Email
                </Text>
              )}
            </Pressable>

            {/* Divider */}
            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />

              <Text style={styles.dividerText}>OR</Text>

              <View style={styles.dividerLine} />
            </View>

            {/* Google Login */}
            <Pressable
              style={({ pressed }) => [
                styles.googleLoginButton,
                pressed && styles.buttonPressed,
                loading && styles.buttonDisabled,
              ]}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading && loadingMethod === 'google' ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <View style={styles.googleIconContainer}>
                    <GoogleLogo />
                  </View>

                  <Text style={styles.googleButtonText}>
                    Continue with Google
                  </Text>

                  <Text style={styles.buttonArrow}>›</Text>
                </>
              )}
            </Pressable>

            {/* Security */}
            <View style={styles.securityNote}>
              <Text style={styles.securityText}>
                Your account is protected and secure
              </Text>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
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

  keyboardAvoiding: {
    flex: 1,
  },

  // Header
  hero: {
    flex: 0.75,
    backgroundColor: '#48142F',
    paddingHorizontal: 27,
    paddingTop: 40,
    paddingBottom: 65,
    overflow: 'hidden',
    justifyContent: 'center',
  },

  heroText: {
    position: 'relative',
    zIndex: 1,
  },

  decorCircle: {
    position: 'absolute',
    width: 270,
    height: 270,
    borderRadius: 135,
    backgroundColor: '#70294D',
    opacity: 0.35,
    right: -120,
    top: 30,
  },

  decorCircleSmall: {
    position: 'absolute',
    width: 125,
    height: 125,
    borderRadius: 63,
    backgroundColor: '#E9C7DB',
    opacity: 0.08,
    left: -45,
    bottom: 20,
  },

  eyebrow: {
    color: '#E9C7DB',
    fontFamily: 'Poppins_500Medium',
    fontSize: 10,
    letterSpacing: 1.5,
    marginBottom: 10,
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
    lineHeight: 19,
    marginTop: 9,
    maxWidth: 290,
  },

  // Login Card
  loginSection: {
    flex: 1.5,
    backgroundColor: '#F4EDF3',
    marginTop: -48,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 27,
    paddingTop: 25,
    paddingBottom: 12,
    elevation: 10,
    zIndex: 2,
  },

  loginScroll: {
    flex: 1,
  },

  loginContent: {
    width: '100%',
    flexGrow: 1,
    paddingBottom: 25,
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
    lineHeight: 19,
    marginTop: 5,
    marginBottom: 16,
  },

  // Inputs
  inputLabel: {
    color: '#48142F',
    fontFamily: 'Poppins_500Medium',
    fontSize: 11,
    marginBottom: 5,
  },

  textInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E1D5DF',
    borderRadius: 13,
    paddingHorizontal: 15,
    paddingVertical: 10,
    color: '#48142F',
    fontFamily: 'Poppins_400Regular',
    fontSize: 12,
    marginBottom: 10,
  },

  inputError: {
    borderColor: '#C74755',
    borderWidth: 1.3,
  },

  fieldError: {
    color: '#B83245',
    fontFamily: 'Poppins_400Regular',
    fontSize: 10,
    marginTop: -7,
    marginBottom: 10,
    marginLeft: 3,
  },

  // Custom Error Box
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FBEAEC',
    borderWidth: 1,
    borderColor: '#F1C7CD',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 11,
    marginTop: 2,
    marginBottom: 12,
  },

  errorIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#C74755',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 9,
  },

  errorIconText: {
    color: '#FFFFFF',
    fontFamily: 'Poppins_700Bold',
    fontSize: 12,
  },

  errorText: {
    flex: 1,
    color: '#A52F40',
    fontFamily: 'Poppins_500Medium',
    fontSize: 10,
    lineHeight: 16,
  },

  // Email Button
  emailLoginButton: {
    backgroundColor: '#48142F',
    borderRadius: 15,
    minHeight: 51,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 3,
    elevation: 3,
  },

  emailLoginButtonText: {
    color: '#FFFFFF',
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 13,
  },

  // Divider
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 13,
  },

  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E1D5DF',
  },

  dividerText: {
    color: '#958594',
    fontFamily: 'Poppins_500Medium',
    fontSize: 10,
    marginHorizontal: 13,
  },

  // Google Button
  googleLoginButton: {
    backgroundColor: '#702449',
    borderRadius: 15,
    minHeight: 53,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    elevation: 3,
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

  googleButtonText: {
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

  buttonPressed: {
    opacity: 0.8,
  },

  buttonDisabled: {
    opacity: 0.6,
  },

  // Security
  securityNote: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 14,
  },

  securityText: {
    color: '#958594',
    fontFamily: 'Poppins_400Regular',
    fontSize: 10,
    textAlign: 'center',
  },
});