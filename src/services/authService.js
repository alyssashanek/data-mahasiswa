import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  GoogleAuthProvider,
  EmailAuthProvider,
  signInWithCredential,
  signInWithEmailAndPassword,
  linkWithCredential,
  signOut,
} from 'firebase/auth';

import { auth } from '../config/firebase';
import GoogleSignin from '../config/googleSignIn';

// Menyimpan informasi profil pengguna
const saveUserProfile = async (user) => {
  const userProfile = {
    uid: user.uid,
    displayName: user.displayName,
    email: user.email,
    photoURL: user.photoURL,
  };

  await AsyncStorage.setItem(
    'user_profile',
    JSON.stringify(userProfile)
  );
};

// Login menggunakan Google
export const loginWithGoogle = async () => {
  await GoogleSignin.hasPlayServices();

  const response = await GoogleSignin.signIn();

  if (response.type !== 'success') {
    return null;
  }

  const idToken = response.data.idToken;

  if (!idToken) {
    throw new Error(
      'Google Sign-In tidak menghasilkan ID Token.'
    );
  }

  const googleCredential =
    GoogleAuthProvider.credential(idToken);

  // Catat metode login sebelum Firebase mengubah sesi
  await AsyncStorage.setItem(
    'login_method',
    'google'
  );

  try {
    const userCredential = await signInWithCredential(
      auth,
      googleCredential
    );

    await saveUserProfile(userCredential.user);

    return userCredential.user;

  } catch (error) {
    await AsyncStorage.removeItem('login_method');
    throw error;
  }
};

// Login menggunakan Email dan Password
export const loginWithEmailPassword = async (
  email,
  password
) => {
  const normalizedEmail = email.trim().toLowerCase();

  if (!normalizedEmail || !password) {
    throw new Error(
      'Email dan password wajib diisi.'
    );
  }

  // Catat metode login sebelum Firebase mengubah sesi
  await AsyncStorage.setItem(
    'login_method',
    'email_password'
  );

  try {
    const userCredential =
      await signInWithEmailAndPassword(
        auth,
        normalizedEmail,
        password
      );

    await saveUserProfile(userCredential.user);

    return userCredential.user;

  } catch (error) {
    await AsyncStorage.removeItem('login_method');
    throw error;
  }
};

// Menghubungkan Email/Password ke akun Google
export const linkEmailPasswordToCurrentUser = async (
  email,
  password
) => {
  const currentUser = auth.currentUser;

  if (!currentUser) {
    throw new Error(
      'Silakan login menggunakan Google terlebih dahulu.'
    );
  }

  const normalizedEmail = email.trim().toLowerCase();

  if (!normalizedEmail || !password) {
    throw new Error(
      'Email dan password wajib diisi.'
    );
  }

  if (
    !currentUser.email ||
    currentUser.email.toLowerCase() !== normalizedEmail
  ) {
    throw new Error(
      'Email harus sama dengan email akun Google.'
    );
  }

  const hasGoogleProvider = currentUser.providerData.some(
    (provider) =>
      provider.providerId === GoogleAuthProvider.PROVIDER_ID
  );

  if (!hasGoogleProvider) {
    throw new Error(
      'Akun yang sedang login bukan akun Google.'
    );
  }

  const hasPasswordProvider = currentUser.providerData.some(
    (provider) =>
      provider.providerId === EmailAuthProvider.PROVIDER_ID
  );

  if (hasPasswordProvider) {
    return {
      user: currentUser,
      alreadyLinked: true,
    };
  }

  const credential = EmailAuthProvider.credential(
    normalizedEmail,
    password
  );

  try {
    const userCredential = await linkWithCredential(
      currentUser,
      credential
    );

    await saveUserProfile(userCredential.user);

    return {
      user: userCredential.user,
      alreadyLinked: false,
    };

  } catch (error) {
    if (
      error.code === 'auth/email-already-in-use' ||
      error.code === 'auth/credential-already-in-use'
    ) {
      throw new Error(
        'Email sudah terhubung dengan akun Firebase lain.'
      );
    }

    throw error;
  }
};

// Logout
export const logoutUser = async () => {
  await signOut(auth);

  try {
    await GoogleSignin.signOut();
  } catch (error) {
    console.log('Google Sign-Out:', error.message);
  }

  await AsyncStorage.removeItem('user_profile');
  await AsyncStorage.removeItem('login_method');
};