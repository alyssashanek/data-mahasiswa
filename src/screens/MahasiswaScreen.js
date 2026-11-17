import React, { useEffect, useState } from 'react';

import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  ActivityIndicator,
  RefreshControl,
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

export default function MahasiswaScreen() {
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

  // Mengambil data mahasiswa dari Firestore
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
      console.log('Firestore mahasiswa error:', err);
      setError('Gagal mengambil data mahasiswa.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadMahasiswa();
  }, []);

  // Tampilan setiap mahasiswa
  const renderMahasiswa = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardAccent} />

      <View style={styles.cardContent}>
        <Text style={styles.studentName}>
          {item.nama || 'Nama tidak tersedia'}
        </Text>

        <View style={styles.infoDivider} />

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>NIM</Text>

          <Text style={styles.studentInfo}>
            {item.nim || '-'}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>
            Program Studi
          </Text>

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
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#48142F" />
      </View>
    );
  }

  return (
    <View style={styles.container}>

      {/* Page Header */}
      <View style={styles.pageHeader}>
        <Text style={styles.pageTitle}>
          Daftar Mahasiswa
        </Text>

        <Text style={styles.pageSubtitle}>
          Informasi mahasiswa yang tersimpan di aplikasi.
        </Text>
      </View>

      {/* Total Mahasiswa */}
      <View style={styles.statCard}>
        <Text style={styles.statLabel}>
          Total Mahasiswa
        </Text>

        <Text style={styles.statValue}>
          {mahasiswa.length}
        </Text>
      </View>

      {/* Loading */}
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
          <Text style={styles.emptyTitle}>
            Data gagal dimuat
          </Text>

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
          style={styles.flatList}
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
              <Text style={styles.emptyTitle}>
                Belum Ada Data
              </Text>

              <Text style={styles.emptyText}>
                Belum ada mahasiswa yang tersimpan.
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4EDF3',
    paddingHorizontal: 22,
    paddingTop: 22,
  },

  // Page Header
  pageHeader: {
    marginBottom: 10,
  },

  pageTitle: {
    color: '#48142F',
    fontFamily: 'Poppins_700Bold',
    fontSize: 24,
    marginTop: 25,
    marginBottom: -5,
  },

  pageSubtitle: {
    color: '#897D89',
    fontFamily: 'Poppins_400Regular',
    fontSize: 11,
  },

  // Total Mahasiswa
  statCard: {
    backgroundColor: '#48142F',
    borderRadius: 17,
    paddingHorizontal: 19,
    paddingVertical: 17,
    marginBottom: 20,
  },

  statLabel: {
    color: '#E9C7DB',
    fontFamily: 'Poppins_500Medium',
    fontSize: 11,
  },

  statValue: {
    color: '#FFFFFF',
    fontFamily: 'Poppins_700Bold',
    fontSize: 30,
    marginTop: 2,
  },

  // Student List
  flatList: {
    flex: 1,
  },

  list: {
    paddingBottom: 20,
    flexGrow: 1,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 13,
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
    padding: 16,
  },

  studentName: {
    color: '#48142F',
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 15,
    marginBottom: 10,
  },

  infoDivider: {
    height: 1,
    backgroundColor: '#F0E8EF',
    marginBottom: 9,
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
    fontSize: 10,
  },

  studentInfo: {
    flex: 1,
    color: '#6F6872',
    fontFamily: 'Poppins_500Medium',
    fontSize: 10,
  },

  // Loading
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  loaderText: {
    fontFamily: 'Poppins_400Regular',
    color: '#897D89',
    fontSize: 11,
    marginTop: 12,
  },

  // Empty State
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },

  emptyTitle: {
    color: '#48142F',
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 15,
    marginBottom: 5,
  },

  emptyText: {
    color: '#897D89',
    fontFamily: 'Poppins_400Regular',
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 18,
  },

  // Retry
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