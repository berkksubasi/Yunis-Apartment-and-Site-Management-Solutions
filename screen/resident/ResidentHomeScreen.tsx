import React from 'react';
import { SafeAreaView, View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack'; 
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../types';

interface ResidentHomeScreenProps {
  announcements: string[];
}

type ResidentHomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ResidentHome'>;

export const ResidentHomeScreen: React.FC<ResidentHomeScreenProps> = ({ announcements }) => {
  const navigation = useNavigation<ResidentHomeScreenNavigationProp>();

  const handleAidatPayment = () => {
    navigation.navigate('AidatPayment');
  };
  
  const handleReportIssue = () => {
    navigation.navigate('ReportIssue');
  };
  
  const handleEmergencyReport = () => {
    navigation.navigate('EmergencyReport');
  };
  
  const renderAnnouncement = ({ item }: { item: string }) => (
    <View style={styles.announcementCard}>
      <Text style={styles.announcementItem}>🔔 {item}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.section}>
          <Image source={require('../../assets/icon.png')} style={styles.logo} />
          <Text style={styles.subtitle}>Duyurular</Text>
          {announcements.length === 0 ? (
            <Text style={styles.noAnnouncements}>Henüz duyuru yok.</Text>
          ) : (
            <FlatList
              data={announcements}
              renderItem={renderAnnouncement}
              keyExtractor={(item, index) => index.toString()}
            />
          )}
        </View>

        {/* Resident Action Buttons */}
        <View style={styles.section}>
          <Text style={styles.subtitle}>İşlemler</Text>
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
    backgroundColor: 'white', 
  },
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 20,
    alignSelf: 'center',
    justifyContent: 'center',
    resizeMode: 'contain',
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
  },
  section: {
    marginBottom: 30,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'left',
    color: 'black',
  },
  noAnnouncements: {
    fontSize: 16,
    fontStyle: 'italic',
    textAlign: 'center',
    color: 'gray',
  },
  announcementCard: {
    backgroundColor: 'white', 
    padding: 15,
    borderRadius: 12, 
    marginVertical: 10,
    shadowColor: 'gray',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3, 
  },
  announcementItem: {
    fontSize: 14,
    fontStyle: 'italic',
    textAlign: 'left',
    fontWeight: '600',
    color: '#333',
  },
  actionButton: {
    backgroundColor: 'gold',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: 'gold',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  actionButtonText: {
    color: 'black', 
    fontSize: 16,
    fontWeight: 'bold',
  },
});
