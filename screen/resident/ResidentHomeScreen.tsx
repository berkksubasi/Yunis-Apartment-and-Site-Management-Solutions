import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, FlatList, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../types';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Announcement {
  message: string;
  block: string;
  scheduledAt: Date;
  mediaUrl?: string;
}

type ResidentHomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ResidentHome'>;

export const ResidentHomeScreen: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const navigation = useNavigation<ResidentHomeScreenNavigationProp>();

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await fetch('https://aparthus-api.vercel.app/api/residents/announcements');
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const data = await response.json();
          if (response.ok) {
            setAnnouncements(data);
          } else {
            console.error('Duyurular getirilirken bir hata oluştu:', data);
            Alert.alert('Hata', data.message || 'Duyurular getirilirken bir sorun oluştu.');
          }
        } else {
          const text = await response.text();
          console.error('Beklenmeyen yanıt:', text);
          Alert.alert('Hata', 'Sunucudan beklenmeyen veri formatı alındı.');
        }
      } catch (error) {
        console.error('Duyurular alınırken hata:', error);
        Alert.alert('Hata', 'Duyurular alınırken bir hata oluştu.');
      }
    };
    fetchAnnouncements();
  }, []);

  const handleAidatPayment = () => {
    navigation.navigate('AidatPayment'); 
  };

  const handleReportIssue = () => {
    navigation.navigate('ReportIssue');
  };

  const handleEmergencyReport = () => {
    navigation.navigate('EmergencyReport'); // EmergencyReportScreen'e yönlendirin
  };

  const renderAnnouncement = ({ item }: { item: Announcement }) => (
    <View style={styles.announcementCard}>
      <Text style={styles.announcementTitle}>🔔 {item.message}</Text>
      <Text style={styles.announcementDate}>🗓️ {new Date(item.scheduledAt).toLocaleString()}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Image source={require('../../assets/icon.png')} style={styles.logo} />
        <Text style={styles.title}>Duyurular</Text>
        {announcements.length === 0 ? (
          <Text style={styles.noAnnouncements}>Henüz duyuru yok.</Text>
        ) : (
          <FlatList
            data={announcements}
            renderItem={renderAnnouncement}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={styles.listContainer}
          />
        )}
        <Text style={styles.title}>İşlemler</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.actionButton} onPress={handleAidatPayment}>
            <Text style={styles.actionButtonText}>Aidat Ödemeleri</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleReportIssue}>
            <Text style={styles.actionButtonText}>Sorun Bildir</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleEmergencyReport}>
            <Text style={styles.actionButtonText}>Acil Durum Bildir</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f4f6fc',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  logo: {
    width: 150,
    height: 150,
    alignSelf: 'center',
    marginBottom: 20,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 20,
    color: '#1f2937',
  },
  noAnnouncements: {
    fontSize: 16,
    color: '#9ca3af',
    textAlign: 'center',
  },
  announcementCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 4,
  },
  announcementTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 5,
  },
  announcementDate: {
    fontSize: 14,
    color: '#6b7280',
  },
  listContainer: {
    paddingBottom: 30,
  },
  buttonContainer: {
    marginTop: 20,
  },
  actionButton: {
    backgroundColor: '#fdd700',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#fbbf24',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  actionButtonText: {
    color: '#111827',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ResidentHomeScreen;
