import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../../types';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

interface AdminHomeScreenProps {
  name: string;
}

export const AdminHomeScreen: React.FC<AdminHomeScreenProps> = () => {
  const [username, setUsername] = useState<string | null>(null);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  // Kullanıcı adını AsyncStorage'dan çek
  useEffect(() => {
    const getUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          const user = JSON.parse(userData);
          setUsername(user.username); // Kullanıcı adını ayarla
        }
      } catch (error) {
        console.error('Kullanıcı verileri alınamadı:', error);
      }
    };

    getUserData();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Image
          source={require('../../assets/icon.png')}
          style={styles.logo}
        />
        <Text style={styles.welcomeText}>Merhaba {username}, Hoşgeldiniz!</Text>
      </View>
      <View style={styles.container}>
        <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('ManageUsers')}>
          <FontAwesome5 name="users-cog" size={24} color="white" />
          <Text style={styles.actionButtonText}>Kullanıcıları Yönet</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('UserManagement')}>
          <FontAwesome5 name="users" size={24} color="white" />
          <Text style={styles.actionButtonText}>Sakinleri Görüntüle</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('ExpenseDetails')}>
          <MaterialIcons name="account-balance" size={24} color="white" />
          <Text style={styles.actionButtonText}>Aidat ve Gider Detayları</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('BankTransactions')}>
          <MaterialIcons name="account-balance-wallet" size={24} color="white" />
          <Text style={styles.actionButtonText}>Banka Hareketleri</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('Announcement')}>
          <MaterialIcons name="announcement" size={24} color="white" />
          <Text style={styles.actionButtonText}>Duyuru Yap</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('TaskTracking')}>
          <MaterialIcons name="assignment" size={24} color="white" />
          <Text style={styles.actionButtonText}>Görev Takip</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('QRCodeScanner')}>
          <MaterialIcons name="qr-code-scanner" size={24} color="white" />
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
  header: {
    backgroundColor: 'black',
    padding: 20,
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 10,
    resizeMode: 'contain',
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  actionButton: {
    backgroundColor: 'gold',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 15,
    flexDirection: 'row',
    elevation: 3,
  },
  actionButtonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});
