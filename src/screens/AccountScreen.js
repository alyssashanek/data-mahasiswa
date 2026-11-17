import React, { useEffect, useState } from 'react';

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  ActivityIndicator,
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

import { useAuth } from '../context/AuthContext';

import {
  linkEmailPasswordToCurrentUser,
  logoutUser,
} from '../services/authService';

// Google Logo
function GoogleLogo({ size = 23 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48">
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

// Email / Mail Logo
function MailLogo({ size = 22 }) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
    >
      <Path
        d="M6 12C6 9.8 7.8 8 10 8H38C40.2 8 42 9.8 42 12V36C42 38.2 40.2 40 38 40H10C7.8 40 6 38.2 6 36V12Z"
        stroke="#702449"
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <Path
        d="M7 12L24 27L41 12"
        stroke="#702449"
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default function AccountScreen() {
  const {
    user,
    profile,
    role,
    loginMethod,
    roleLoading,
    roleError,
  } = useAuth();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [linking, setLinking] = useState(false);
  const [linkError, setLinkError] = useState('');
  const [linkSuccess, setLinkSuccess] = useState('');

  const [googleConnected, setGoogleConnected] = useState(false);
  const [passwordConnected, setPasswordConnected] = useState(false);

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  // Periksa provider yang terhubung
  useEffect(() => {
    const providers = user?.providerData || [];

    setGoogleConnected(
      providers.some(
        (item) => item.providerId === 'google.com'
      )
    );

    setPasswordConnected(
      providers.some(
        (item) => item.providerId === 'password'
      )
    );
  }, [user]);

  // Metode login saat ini
  const getLoginMethod = () => {
    if (loginMethod === 'google') {
      return 'Google';
    }

    if (loginMethod === 'email_password') {
      return 'Email/Password';
    }

    return 'Tidak diketahui';
  };

  // Ikon metode login aktif
  const renderLoginMethodIcon = () => {
    if (loginMethod === 'google') {
      return <GoogleLogo size={23} />;
    }

    if (loginMethod === 'email_password') {
      return <MailLogo size={23} />;
    }

    return null;
  };

  // Menghubungkan Email/Password
  const handleLinkAccount = async () => {
    setLinkError('');
    setLinkSuccess('');

    if (!password || !confirmPassword) {
      setLinkError(
        'Password dan konfirmasi password wajib diisi.'
      );
      return;
    }

    if (password.length < 6) {
      setLinkError(
        'Password minimal terdiri dari 6 karakter.'
      );
      return;
    }

    if (password !== confirmPassword) {
      setLinkError(
        'Konfirmasi password tidak sama.'
      );
      return;
    }

    try {
      setLinking(true);

      const result = await linkEmailPasswordToCurrentUser(
        user.email,
        password
      );

      setPasswordConnected(true);
      setPassword('');
      setConfirmPassword('');

      setLinkSuccess(
        result.alreadyLinked
          ? 'Email/Password sudah terhubung dengan akun ini.'
          : 'Email/Password berhasil dihubungkan ke akun Google.'
      );

    } catch (error) {
      console.log('Account Linking Error:', error);

      setLinkError(
        error.message || 'Gagal menghubungkan Email/Password.'
      );
    } finally {
      setLinking(false);
    }
  };

  // Logout
  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.log('Logout Error:', error);
      setLinkError('Terjadi kesalahan saat logout.');
    }
  };

  const displayName =
    user?.displayName ||
    profile?.displayName ||
    'Pengguna';

  const email =
    user?.email ||
    profile?.email ||
    '-';

  if (!fontsLoaded) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator
          size="large"
          color="#48142F"
        />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.scrollContent}
      >
        {/* Page Header */}
        <View style={styles.pageHeader}>
          <Text style={styles.pageTitle}>
            Informasi Akun
          </Text>
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {displayName.charAt(0).toUpperCase()}
            </Text>
          </View>

          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>
              {displayName}
            </Text>

            <Text style={styles.profileEmail}>
              {email}
            </Text>
          </View>

          <View style={styles.roleBadge}>
            <Text style={styles.roleBadgeText}>
              {roleLoading ? 'MEMUAT' : role || 'NO ROLE'}
            </Text>
          </View>
        </View>

        {/* Firebase Account Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Detail Akun Firebase
          </Text>

          <View style={styles.infoCard}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>
                Nama Pengguna
              </Text>

              <Text style={styles.infoValue}>
                {displayName}
              </Text>
            </View>

            <View style={styles.infoDivider} />

            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>
                Email
              </Text>

              <Text style={styles.infoValue}>
                {email}
              </Text>
            </View>

            <View style={styles.infoDivider} />

            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>
                Firebase UID
              </Text>

              <Text style={styles.uidValue} selectable>
                {user?.uid || '-'}
              </Text>
            </View>

            <View style={styles.infoDivider} />

            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>
                Role Pengguna
              </Text>

              <Text style={styles.infoValue}>
                {roleLoading
                  ? 'Memuat role...'
                  : role || 'Role belum tersedia'}
              </Text>

              {roleError ? (
                <Text style={styles.errorText}>
                  {roleError}
                </Text>
              ) : null}
            </View>
          </View>
        </View>

        {/* Login Session */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Aktivitas Login
          </Text>

          <View style={styles.sessionCard}>
            <Text style={styles.infoLabel}>
              Login saat ini menggunakan
            </Text>

            <View style={styles.loginMethodRow}>
              <View style={styles.methodIcon}>
                {renderLoginMethodIcon()}
              </View>

              <View style={styles.methodInfo}>
                <Text style={styles.methodName}>
                  {getLoginMethod()}
                </Text>

                <Text style={styles.methodDescription}>
                  Metode autentikasi sesi aktif
                </Text>
              </View>

              <View style={styles.activeBadge}>
                <Text style={styles.activeBadgeText}>
                  AKTIF
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Connected Providers */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Provider Terhubung
          </Text>

          <View style={styles.providerCard}>

            {/* Google Provider */}
            <View style={styles.providerRow}>
              <View style={[styles.providerIcon, styles.googleIcon]}>
                <GoogleLogo size={23} />
              </View>

              <View style={styles.providerInfo}>
                <Text style={styles.providerName}>
                  Google
                </Text>

                <Text style={styles.providerDescription}>
                  Sign in with Google
                </Text>
              </View>

              <View
                style={[
                  styles.statusBadge,
                  googleConnected
                    ? styles.connectedBadge
                    : styles.disconnectedBadge,
                ]}
              >
                <Text
                  style={[
                    styles.statusText,
                    googleConnected
                      ? styles.connectedText
                      : styles.disconnectedText,
                  ]}
                >
                  {googleConnected
                    ? 'Terhubung'
                    : 'Belum terhubung'}
                </Text>
              </View>
            </View>

            <View style={styles.infoDivider} />

            {/* Email Password Provider */}
            <View style={styles.providerRow}>
              <View style={[styles.providerIcon, styles.emailIcon]}>
                <MailLogo size={22} />
              </View>

              <View style={styles.providerInfo}>
                <Text style={styles.providerName}>
                  Email/Password
                </Text>

                <Text style={styles.providerDescription}>
                  Login menggunakan email dan password
                </Text>
              </View>

              <View
                style={[
                  styles.statusBadge,
                  passwordConnected
                    ? styles.connectedBadge
                    : styles.disconnectedBadge,
                ]}
              >
                <Text
                  style={[
                    styles.statusText,
                    passwordConnected
                      ? styles.connectedText
                      : styles.disconnectedText,
                  ]}
                >
                  {passwordConnected
                    ? 'Terhubung'
                    : 'Belum terhubung'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Link Email/Password */}
        {googleConnected && !passwordConnected ? (
          <View style={styles.section}>
            <View style={styles.linkCard}>
              <Text style={styles.linkTitle}>
                Hubungkan Email/Password
              </Text>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>
                  Email Akun Google
                </Text>

                <TextInput
                  style={styles.input}
                  value={email}
                  editable={false}
                  selectTextOnFocus={false}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>
                  Buat Password
                </Text>

                <TextInput
                  style={styles.input}
                  placeholder="Masukkan password"
                  placeholderTextColor="#A99AA6"
                  value={password}
                  onChangeText={(value) => {
                    setPassword(value);
                    setLinkError('');
                  }}
                  secureTextEntry
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>
                  Konfirmasi Password
                </Text>

                <TextInput
                  style={styles.input}
                  placeholder="Masukkan ulang password"
                  placeholderTextColor="#A99AA6"
                  value={confirmPassword}
                  onChangeText={(value) => {
                    setConfirmPassword(value);
                    setLinkError('');
                  }}
                  secureTextEntry
                  autoCapitalize="none"
                />
              </View>

              {linkError ? (
                <View style={styles.linkErrorBox}>
                  <Text style={styles.linkErrorText}>
                    {linkError}
                  </Text>
                </View>
              ) : null}

              {linkSuccess ? (
                <View style={styles.linkSuccessBox}>
                  <Text style={styles.linkSuccessText}>
                    {linkSuccess}
                  </Text>
                </View>
              ) : null}

              <Pressable
                style={({ pressed }) => [
                  styles.linkButton,
                  pressed && styles.buttonPressed,
                  linking && styles.buttonDisabled,
                ]}
                onPress={handleLinkAccount}
                disabled={linking}
              >
                {linking ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.linkButtonText}>
                    Hubungkan Email/Password
                  </Text>
                )}
              </Pressable>
            </View>
          </View>
        ) : null}

        {/* Already Linked Information */}
        {passwordConnected ? (
          <View style={styles.linkSuccessBox}>
            <Text style={styles.linkSuccessText}>
              Akun sudah memiliki provider Google dan Email/Password.
              Kamu dapat login menggunakan kedua metode tersebut.
            </Text>
          </View>
        ) : null}

        {/* Logout */}
        <Pressable
          style={({ pressed }) => [
            styles.logoutButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={handleLogout}
        >
          <Text style={styles.logoutButtonText}>
            Logout
          </Text>
        </Pressable>

        <Text style={styles.footerText}>
          Firebase Authentication & Cloud Firestore
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4EDF3',
  },

  scrollContent: {
    paddingHorizontal: 22,
    paddingTop: 22,
    paddingBottom: 30,
  },

  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Page Header
  pageHeader: {
    marginBottom: 5,
  },

  pageTitle: {
    color: '#48142F',
    fontFamily: 'Poppins_700Bold',
    fontSize: 24,
    marginTop: 25,
  },

  // Profile Card
  profileCard: {
    backgroundColor: '#48142F',
    borderRadius: 18,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
    elevation: 3,
  },

  avatar: {
    width: 48,
    height: 48,
    backgroundColor: '#702449',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },

  avatarText: {
    color: '#FFFFFF',
    fontFamily: 'Poppins_700Bold',
    fontSize: 21,
  },

  profileInfo: {
    flex: 1,
    marginLeft: 12,
  },

  profileName: {
    color: '#FFFFFF',
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 13,
  },

  profileEmail: {
    color: '#E9C7DB',
    fontFamily: 'Poppins_400Regular',
    fontSize: 9,
    marginTop: 3,
  },

  roleBadge: {
    backgroundColor: '#E7F5EB',
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 8,
    marginLeft: 6,
    marginBottom: 30,
  },

  roleBadgeText: {
    color: '#278247',
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 8,
  },

  // Sections
  section: {
    marginBottom: 22,
  },

  sectionTitle: {
    color: '#48142F',
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 15,
    marginBottom: 11,
  },

  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    elevation: 2,
  },

  infoItem: {
    paddingVertical: 7,
    gap: 4,
  },

  infoLabel: {
    color: '#958594',
    fontFamily: 'Poppins_400Regular',
    fontSize: 10,
  },

  infoValue: {
    color: '#48142F',
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 12,
  },

  uidValue: {
    color: '#6F6872',
    fontFamily: 'Poppins_400Regular',
    fontSize: 10,
    lineHeight: 18,
  },

  infoDivider: {
    height: 1,
    backgroundColor: '#F0E8EF',
    marginVertical: 8,
  },

  errorText: {
    color: '#B83245',
    fontFamily: 'Poppins_400Regular',
    fontSize: 10,
    marginTop: 5,
  },

  // Login Session
  sessionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    elevation: 2,
  },

  loginMethodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },

  methodIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F4EDF3',
    alignItems: 'center',
    justifyContent: 'center',
  },

  methodInfo: {
    flex: 1,
    marginLeft: 11,
  },

  methodName: {
    color: '#48142F',
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 12,
  },

  methodDescription: {
    color: '#958594',
    fontFamily: 'Poppins_400Regular',
    fontSize: 9,
    marginTop: 3,
  },

  activeBadge: {
    backgroundColor: '#E7F5EB',
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 7,
  },

  activeBadgeText: {
    color: '#278247',
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 8,
  },

  // Connected Providers
  providerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 15,
    elevation: 2,
  },

  providerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  providerIcon: {
    width: 39,
    height: 39,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },

  googleIcon: {
    backgroundColor: '#F0F4FF',
  },

  emailIcon: {
    backgroundColor: '#F4EDF3',
  },

  providerInfo: {
    flex: 1,
    marginLeft: 11,
  },

  providerName: {
    color: '#48142F',
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 11,
  },

  providerDescription: {
    color: '#958594',
    fontFamily: 'Poppins_400Regular',
    fontSize: 9,
    marginTop: 3,
  },

  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 7,
    marginLeft: 5,
  },

  connectedBadge: {
    backgroundColor: '#E7F5EB',
  },

  disconnectedBadge: {
    backgroundColor: '#FFF2E1',
  },

  statusText: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 8,
  },

  connectedText: {
    color: '#278247',
  },

  disconnectedText: {
    color: '#B7791F',
  },

  // Account Linking
  linkCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    elevation: 2,
  },

  linkTitle: {
    color: '#48142F',
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 14,
    marginBottom: 15,
  },

  inputGroup: {
    marginBottom: 12,
  },

  inputLabel: {
    color: '#48142F',
    fontFamily: 'Poppins_500Medium',
    fontSize: 10,
    marginBottom: 6,
  },

  input: {
    backgroundColor: '#F8F3F7',
    borderWidth: 1,
    borderColor: '#E7DCE5',
    borderRadius: 11,
    paddingHorizontal: 12,
    paddingVertical: 11,
    color: '#48142F',
    fontFamily: 'Poppins_400Regular',
    fontSize: 11,
  },

  linkErrorBox: {
    backgroundColor: '#FBEAEC',
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
  },

  linkErrorText: {
    color: '#A52F40',
    fontFamily: 'Poppins_500Medium',
    fontSize: 10,
  },

  linkSuccessBox: {
    backgroundColor: '#E7F5EB',
    borderRadius: 11,
    padding: 12,
    marginBottom: 15,
  },

  linkSuccessText: {
    color: '#278247',
    fontFamily: 'Poppins_500Medium',
    fontSize: 10,
    lineHeight: 17,
  },

  linkButton: {
    backgroundColor: '#702449',
    borderRadius: 12,
    minHeight: 47,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
  },

  linkButtonText: {
    color: '#FFFFFF',
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 11,
  },

  buttonPressed: {
    opacity: 0.8,
  },

  buttonDisabled: {
    opacity: 0.6,
  },

  // Logout
  logoutButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8D7E1',
    borderRadius: 13,
    minHeight: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
  },

  logoutButtonText: {
    color: '#A52F40',
    fontFamily: 'Poppins_700Bold',
    fontSize: 12,
  },

  footerText: {
    color: '#A99AA6',
    fontFamily: 'Poppins_400Regular',
    fontSize: 9,
    textAlign: 'center',
    marginTop: 20,
  },
});