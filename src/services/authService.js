import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  GoogleAuthProvider,
  signInWithCredential,
  signOut,
} from 'firebase/auth';

import { auth } from '../config/firebase';
import GoogleSignin from '../config/googleSignIn';

// Proses login menggunakan akun Google
export const loginWithGoogle = async () => {
  await GoogleSignin.hasPlayServices();

  const response = await GoogleSignin.signIn();

  // Periksa apakah pengguna berhasil memilih akun
  if (response.type !== 'success') {
    return null;
  }

  const idToken = response.data.idToken;

  if (!idToken) {
    throw new Error('Google Sign-In tidak menghasilkan ID Token.');
  }

  // Ubah ID Token Google menjadi kredensial Firebase
  const googleCredential = GoogleAuthProvider.credential(idToken);

  // Login ke Firebase Authentication
  const userCredential = await signInWithCredential(
    auth,
    googleCredential
  );

  const user = userCredential.user;

  // Simpan informasi profil pengguna ke AsyncStorage
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

  return user;
};

// Proses logout
export const logoutUser = async () => {
  await signOut(auth);

  try {
    await GoogleSignin.signOut();
  } finally {
    await AsyncStorage.removeItem('user_profile');
  }
};