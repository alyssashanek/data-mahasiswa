import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

import { auth, db } from '../config/firebase';

const AuthContext = createContext(null);

// Menentukan metode login jika informasi lokal belum tersedia
const getFallbackLoginMethod = (firebaseUser) => {
  const providers = firebaseUser.providerData || [];

  const hasGoogle = providers.some(
    (item) => item.providerId === 'google.com'
  );

  const hasPassword = providers.some(
    (item) => item.providerId === 'password'
  );

  if (hasGoogle && !hasPassword) {
    return 'google';
  }

  if (hasPassword && !hasGoogle) {
    return 'email_password';
  }

  // Jika dua provider sudah terhubung,
  // metode login tidak bisa diketahui hanya dari providerData.
  return null;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [role, setRole] = useState(null);

  const [loginMethod, setLoginMethod] = useState(null);

  const [loading, setLoading] = useState(true);
  const [roleLoading, setRoleLoading] = useState(false);
  const [roleError, setRoleError] = useState('');

  useEffect(() => {
    let active = true;
    let latestRequest = 0;

    const unsubscribe = onAuthStateChanged(
      auth,
      async (firebaseUser) => {
        const requestId = ++latestRequest;

        if (!active) return;

        setUser(firebaseUser);
        setProfile(null);
        setRole(null);
        setLoginMethod(null);
        setRoleError('');
        setLoading(true);

        // Jika pengguna logout
        if (!firebaseUser) {
          setRoleLoading(false);

          try {
            await AsyncStorage.removeItem('user_profile');
            await AsyncStorage.removeItem('login_method');
          } catch (error) {
            console.log('Gagal membersihkan data sesi:', error);
          } finally {
            if (active && requestId === latestRequest) {
              setLoading(false);
            }
          }

          return;
        }

        setRoleLoading(true);

        // Informasi dasar dari Firebase Authentication
        const authProfile = {
          uid: firebaseUser.uid,
          displayName: firebaseUser.displayName,
          email: firebaseUser.email,
          photoURL: firebaseUser.photoURL,
        };

        try {
          // Mengambil metode login dari AsyncStorage
          const storedMethod = await AsyncStorage.getItem(
            'login_method'
          );

          if (!active || requestId !== latestRequest) {
            return;
          }

          const validStoredMethod =
            storedMethod === 'google' ||
            storedMethod === 'email_password'
              ? storedMethod
              : null;

          const currentMethod =
            validStoredMethod ||
            getFallbackLoginMethod(firebaseUser);

          setLoginMethod(currentMethod);

          // Mengambil dokumen berdasarkan Firebase UID
          const userRef = doc(
            db,
            'users',
            firebaseUser.uid
          );

          const userSnapshot = await getDoc(userRef);

          if (!active || requestId !== latestRequest) {
            return;
          }

          // Log verifikasi Firebase dan Firestore
          console.log('========== ROLE VERIFICATION ==========');

          console.log(
            'Firebase UID:',
            firebaseUser.uid
          );

          console.log(
            'Login Method:',
            currentMethod || 'UNKNOWN'
          );

          console.log(
            'Document Path:',
            `users/${firebaseUser.uid}`
          );

          console.log(
            'Document Exists:',
            userSnapshot.exists()
          );

          // Jika dokumen tidak ditemukan
          if (!userSnapshot.exists()) {
            setProfile(authProfile);
            setRole(null);

            setRoleError(
              'Profil pengguna belum ditemukan di Firestore.'
            );

            console.log('Firestore Role: NOT FOUND');
            console.log('=======================================');

            await saveProfile(authProfile);
            return;
          }

          // Mengambil data dari Firestore
          const firestoreData = userSnapshot.data();

          const userRole =
            typeof firestoreData.role === 'string'
              ? firestoreData.role.trim()
              : '';

          const userProfile = {
            ...firestoreData,
            ...authProfile,
            displayName:
              authProfile.displayName ||
              firestoreData.displayName ||
              'Pengguna',
            role: userRole || null,
          };

          setProfile(userProfile);

          // Menyimpan role dari Firestore
          if (userRole !== '') {
            setRole(userRole);
            setRoleError('');
          } else {
            setRole(null);

            setRoleError(
              'Role pengguna belum ditentukan di Firestore.'
            );
          }

          console.log(
            'Firestore Role:',
            userRole || 'ROLE NOT FOUND'
          );

          console.log('=======================================');

          // Simpan profil lokal
          await saveProfile(userProfile);

        } catch (error) {
          console.log(
            'Gagal mengambil profil pengguna:',
            error
          );

          if (!active || requestId !== latestRequest) {
            return;
          }

          setProfile(authProfile);
          setRole(null);

          setRoleError(
            'Gagal mengambil role dari Firestore. Periksa koneksi dan Firestore Rules.'
          );
        } finally {
          if (active && requestId === latestRequest) {
            setRoleLoading(false);
            setLoading(false);
          }
        }
      }
    );

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  const value = {
    user,
    profile,
    role,
    loginMethod,
    loading,
    roleLoading,
    roleError,
    isLoggedIn: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Menyimpan profil ke AsyncStorage
const saveProfile = async (profile) => {
  try {
    await AsyncStorage.setItem(
      'user_profile',
      JSON.stringify(profile)
    );
  } catch (error) {
    console.log('Gagal menyimpan profil:', error);
  }
};

// Custom Hook
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      'useAuth harus digunakan di dalam AuthProvider'
    );
  }

  return context;
};