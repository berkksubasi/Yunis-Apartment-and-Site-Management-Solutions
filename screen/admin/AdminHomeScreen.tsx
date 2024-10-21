import React from 'react';
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../../types';

interface AdminHomeScreenProps {
  name: string; 
}

export const AdminHomeScreen: React.FC<AdminHomeScreenProps> = ({ name }) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Image
          source={require('../../assets/icon.png')}
          style={styles.logo}
        />
        <Text style={styles.title}>Merhaba {name}, Hoşgeldiniz!</Text> 
      </View>
      <View style={styles.container1}>
        <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('ManageUsers')}>
          <Text style={styles.actionButtonText}>Kullanıcıları Yönet</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('ExpenseDetails')}>
          <Text style={styles.actionButtonText}>Aidat ve Gider Detayları</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('Announcement')}>
          <Text style={styles.actionButtonText}>Duyuru Yap</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('QRCodeScanner')}>
          <Text style={styles.actionButtonText}>QR Kod ile Ziyaretçi Girişi</Text>
        </TouchableOpacity>
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
    backgroundColor: 'white',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container1: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  logo: {
    width: 300,
    height: 300,
    marginTop: 20,
    marginBottom: 10,
    resizeMode: 'contain',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: 'black',
  },
  actionButton: {
    backgroundColor: '#1E88E5',
    paddingVertical: 15,
    borderRadius: 12, 
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#1E88E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
