import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Alert, Image, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LoginButton } from '../components/LoginButton';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';

interface LoginScreenProps {
  setrole: (role: 'admin' | 'resident' | 'security') => void;
}

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

export const LoginScreen: React.FC<LoginScreenProps> = ({ setrole }) => {
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<LoginScreenNavigationProp>();

  const handleLogin = async () => {
    setLoading(true);

    if (!usernameOrEmail || !password) {
      Alert.alert('Hata', 'Kullanıcı adı veya e-posta ve şifre gereklidir.');
      setLoading(false);
      return;
    }

    try {
      const isResident = !usernameOrEmail.includes('@'); // '@' içermiyorsa resident için username kullanılıyor

      const loginEndpoint = isResident
        ? 'https://yunis-api.vercel.app/api/residents/login'
        : 'https://yunis-api.vercel.app/api/login'; // admin ve diğer kullanıcılar için email kullanarak giriş yapılacak

      const requestBody = isResident
        ? { username: usernameOrEmail, password }
        : { email: usernameOrEmail, password };

      const response = await fetch(loginEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (response.ok) {
        const role = data.role || data.resident?.role;
        const residentId = data.resident?._id; // resident ID'yi buradan alıyoruz

        if (role) {
          await AsyncStorage.setItem('role', role);
          if (residentId) {
            await AsyncStorage.setItem('residentId', residentId); // Resident ID'yi kaydediyoruz
          }
          setrole(role);

          if (role === 'resident') {
            navigation.navigate('ResidentHome');
          } else if (role === 'admin') {
            navigation.navigate('AdminHome');
          } else if (role === 'security') {
            navigation.navigate('SecurityHome');
          }
        } else {
          console.error('Sunucudan beklenmeyen yanıt alındı:', data);
          Alert.alert('Hata', 'Sunucudan beklenmeyen yanıt alındı.');
        }
      } else {
        console.error('Hatalı giriş:', data.message || 'Giriş başarısız.');
        Alert.alert('Hatalı giriş', data.message || 'Giriş başarısız.');
      }
    } catch (error) {
      console.error('Bağlantı hatası:', error);
      Alert.alert('Bağlantı hatası', 'Sunucuya ulaşılamıyor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/logo.png')} style={styles.logo} />
      <TextInput
        style={styles.input}
        placeholder="Kullanıcı Adı veya E-posta"
        value={usernameOrEmail}
        onChangeText={setUsernameOrEmail}
        placeholderTextColor="#8A8A8A"
      />
      <TextInput
        style={styles.input}
        placeholder="Şifre"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        placeholderTextColor="#8A8A8A"
      />
      <View style={styles.buttonContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#FFFFFF" />
        ) : (
          <LoginButton title="Giriş Yap" onPress={handleLogin} />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'black',
    alignItems: 'center',
  },
  logo: {
    width: 400,
    height: 200,
    marginBottom: 20,
    alignSelf: 'center',
    resizeMode: 'contain',
  },
  input: {
    height: 50,
    borderColor: '#E0E0E0',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
    fontSize: 16,
    color: '#333',
    width: '100%',
  },
  buttonContainer: {
    width: '100%',
    alignSelf: 'center',
  },
});
