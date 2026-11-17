
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  ActivityIndicator,
  RefreshControl,
  Alert,
  SafeAreaView,
  StatusBar,
} from 'react-native';

import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins';

import { collection, getDocs } from 'firebase/firestore';

import { db } from '../config/firebase';
import { useAuth } from '../context/AuthContext';
import { logoutUser } from '../services/authService';

export default function HomeScreen() {
  const { user } = useAuth();

  const [mahasiswa, setMahasiswa] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  const loadMahasiswa = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError('');

      const snapshot = await getDocs(
        collection(db, 'mahasiswa')
      );

      const data = snapshot.docs.map((item) => ({
        id: item.id,
        ...item.data(),
      }));

      setMahasiswa(data);
    } catch (err) {
      console.log('Firestore error:', err);
      setError('Gagal mengambil data mahasiswa.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadMahasiswa();
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (err) {
      Alert.alert('Logout Gagal', err.message);
    }
  };

  const renderMahasiswa = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardAccent} />

      <View style={styles.cardContent}>
        <Text style={styles.studentName}>
          {item.nama || 'Nama tidak tersedia'}
        </Text>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>NIM</Text>
          <Text style={styles.studentInfo}>
            {item.nim || '-'}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Program Studi</Text>
          <Text style={styles.studentInfo}>
            {item.prodi || '-'}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Semester</Text>
          <Text style={styles.studentInfo}>
            {item.semester ?? '-'}
          </Text>
        </View>
      </View>
    </View>
  );

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

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.profile}>
          <Text style={styles.greeting}>
            Selamat Datang,
          </Text>

          <Text style={styles.userName}>
            {user?.displayName || 'Pengguna'}
          </Text>

          <Text style={styles.email} numberOfLines={1}>
            {user?.email || ''}
          </Text>
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.logoutButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={handleLogout}
        >
          <Text style={styles.logoutText}>
            Logout
          </Text>
        </Pressable>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>
              Data Mahasiswa
            </Text>

            <Text style={styles.sectionSubtitle}>
              {mahasiswa.length} mahasiswa tersimpan di Firebase.
            </Text>
          </View>
        </View>

        {loading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator
              size="large"
              color="#48142F"
            />

            <Text style={styles.loaderText}>
              Memuat data mahasiswa...
            </Text>
          </View>
        ) : error ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {error}
            </Text>

            <Pressable
              style={styles.retryButton}
              onPress={() => loadMahasiswa()}
            >
              <Text style={styles.retryText}>
                Coba Lagi
              </Text>
            </Pressable>
          </View>
        ) : (
          <FlatList
            data={mahasiswa}
            renderItem={renderMahasiswa}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => loadMahasiswa(true)}
                colors={['#48142F']}
                tintColor="#48142F"
              />
            }
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                  Belum ada data mahasiswa.
                </Text>
              </View>
            }
          />
        )}
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
    backgroundColor: '#F4EDF3',
  },

  // Header
  header: {
    backgroundColor: '#48142F',
    paddingHorizontal: 25,
    paddingTop: 45,
    paddingBottom: 35,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  profile: {
    flex: 1,
    marginRight: 15,
  },

  greeting: {
    color: '#D9AFC7',
    fontFamily: 'Poppins_400Regular',
    fontSize: 12,
  },

  userName: {
    color: '#FFFFFF',
    fontFamily: 'Poppins_700Bold',
    fontSize: 21,
    marginTop: 4,
  },

  email: {
    color: '#E2CEDA',
    fontFamily: 'Poppins_400Regular',
    fontSize: 11,
    marginTop: 3,
  },

  logoutButton: {
    backgroundColor: '#F4EDF3',
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },

  logoutText: {
    color: '#48142F',
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 11,
  },

  buttonPressed: {
    opacity: 0.75,
  },

  // Main Content
  content: {
    flex: 1,
    paddingHorizontal: 22,
    paddingTop: 20,
  },

  sectionHeader: {
    marginBottom: 20,
  },

  sectionTitle: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 21,
    color: '#48142F',
  },

  sectionSubtitle: {
    color: '#897D89',
    fontFamily: 'Poppins_400Regular',
    fontSize: 11,
    marginTop: 4,
  },

  // Student Card
  list: {
    paddingBottom: 25,
    flexGrow: 1,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 17,
    marginBottom: 14,
    flexDirection: 'row',
    overflow: 'hidden',
    elevation: 2,
  },

  cardAccent: {
    width: 5,
    backgroundColor: '#702449',
  },

  cardContent: {
    flex: 1,
    padding: 17,
  },

  studentName: {
    color: '#48142F',
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 15,
    marginBottom: 11,
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 5,
  },

  infoLabel: {
    width: 105,
    color: '#958594',
    fontFamily: 'Poppins_400Regular',
    fontSize: 11,
  },

  studentInfo: {
    flex: 1,
    color: '#6F6872',
    fontFamily: 'Poppins_500Medium',
    fontSize: 11,
  },

  // Loading and Empty State
  loaderContainer: {
    alignItems: 'center',
    marginTop: 65,
  },

  loaderText: {
    fontFamily: 'Poppins_400Regular',
    color: '#897D89',
    fontSize: 11,
    marginTop: 12,
  },

  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 55,
  },

  emptyText: {
    color: '#897D89',
    fontFamily: 'Poppins_400Regular',
    fontSize: 12,
    textAlign: 'center',
  },

  retryButton: {
    backgroundColor: '#48142F',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 11,
    marginTop: 18,
  },

  retryText: {
    color: '#FFFFFF',
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 11,
  },
});
