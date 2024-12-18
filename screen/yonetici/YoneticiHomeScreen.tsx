import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../../types';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

interface YoneticiHomeScreenProps {
  name: string;
}

export const YoneticiHomeScreen: React.FC<YoneticiHomeScreenProps> = () => {
  const [username, setUsername] = useState<string>(''); 
  const [firstName, setFirstName] = useState<string>('');
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

useEffect(() => {
  console.log('useEffect çağrıldı, kullanıcı verileri alınıyor...');
  const getUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      console.log('AsyncStorage den dönen ham değer:', userData);

      if (userData) {
        const user = JSON.parse(userData);
        console.log('JSON parse sonrası kullanıcı verileri:', user);

        if (user?.username) {
          setUsername(user.username);
          console.log('Kullanıcı adı ayarlandı:', user.username);
        }
        if (user?.firstName) {
          setFirstName(user.firstName);
          console.log('Yönetici adı ayarlandı:', user.firstName);
        }
      } else {
        console.log('Kullanıcı verileri bulunamadı.');
      }
    } catch (error) {
      console.error('Kullanıcı verileri alınamadı:', error);
    }
  };

  getUserData();
}, []);


  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header bölümü, kullanıcıya hoşgeldiniz mesajı ve logo */}
      <View style={styles.header}>
        <Image
          source={require('../../assets/icon.png')}
          style={styles.logo}
        />
        <Text style={styles.welcomeText}>
          {firstName ? `Merhaba ${firstName}, Hoşgeldin!` : 'Merhaba, Hoşgeldiniz!'}
        </Text>
      </View>
      {/* Ana işlem butonları bölümü */}
      <View style={styles.container}>
        {/* Sakinleri Görüntüle butonu */}
        <TouchableOpacity style={styles.actionButton} onPress={() => {
          console.log('Sakinleri Görüntüle butonuna tıklandı');
          navigation.navigate('UserManagement');
        }}>
          <FontAwesome5 name="users" size={24} color="white" />
          <Text style={styles.actionButtonText}>Sakinleri Görüntüle</Text>
        </TouchableOpacity>
        {/* Aidat ve Gider Detayları butonu */}
        <TouchableOpacity style={styles.actionButton} onPress={() => {
          console.log('Aidat ve Gider Detayları butonuna tıklandı');
          navigation.navigate('ExpenseDetails');
        }}>
          <MaterialIcons name="account-balance" size={24} color="white" />
          <Text style={styles.actionButtonText}>Aidat ve Gider Detayları</Text>
        </TouchableOpacity>
        {/* Banka Hareketleri butonu */}
        <TouchableOpacity style={styles.actionButton} onPress={() => {
          console.log('Banka Hareketleri butonuna tıklandı');
          navigation.navigate('BankTransactions');
        }}>
          <MaterialIcons name="account-balance-wallet" size={24} color="white" />
          <Text style={styles.actionButtonText}>Banka Hareketleri</Text>
        </TouchableOpacity>
        {/* Duyuru Yap butonu */}
        <TouchableOpacity style={styles.actionButton} onPress={() => {
          console.log('Duyuru Yap butonuna tıklandı');
          navigation.navigate('Announcement');
        }}>
          <MaterialIcons name="announcement" size={24} color="white" />
          <Text style={styles.actionButtonText}>Duyuru Yap</Text>
        </TouchableOpacity>
        {/* Görev Takip butonu */}
        <TouchableOpacity style={styles.actionButton} onPress={() => {
          console.log('Görev Takip butonuna tıklandı');
          navigation.navigate('TaskTracking');
        }}>
          <MaterialIcons name="assignment" size={24} color="white" />
          <Text style={styles.actionButtonText}>Görev Takip</Text>
        </TouchableOpacity>
        {/* QR Kod ile Ziyaretçi Girişi butonu */}
        <TouchableOpacity style={styles.actionButton} onPress={() => {
          console.log('QR Kod ile Ziyaretçi Girişi butonuna tıklandı');
          navigation.navigate('QRCodeScanner');
        }}>
          <MaterialIcons name="qr-code-scanner" size={24} color="white" />
          <Text style={styles.actionButtonText}>Ziyaretçi Girişi</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: 30,
  },
  header: {
    backgroundColor: 'white',
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
    color: 'black',
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
