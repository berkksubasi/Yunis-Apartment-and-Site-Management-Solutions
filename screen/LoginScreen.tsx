import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Alert, Image, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LoginButton } from '../components/LoginButton';

interface LoginScreenProps {
  setUserType: (userType: 'admin' | 'resident' | 'security') => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ setUserType }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      // Prod ortamındaki Vercel API URL'sini kullanın
      const response = await fetch('https://yunis-apartment-and-site-management-solutions.vercel.app/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      setLoading(false);

      if (response.ok) {
        if (data.token) {
          await AsyncStorage.setItem('authToken', data.token);
        }

        switch (data.userType) {
          case 'admin':
            setUserType('admin');
            break;
          case 'resident':
            setUserType('resident');
            break;
          case 'security':
            setUserType('security');
            break;
          default:
            Alert.alert('Hatalı giriş', 'Kullanıcı tipi tanınmadı.');
        }
      } else {
        Alert.alert('Hatalı giriş', data.message || 'Giriş başarısız.');
      }
    } catch (error) {
      setLoading(false);
      Alert.alert('Bağlantı hatası', 'Sunucuya ulaşılamıyor.');
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/logo.png')} style={styles.logo} />
      <TextInput
        style={styles.input}
        placeholder="Kullanıcı Adı"
        value={username}
        onChangeText={setUsername}
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
    shadowColor: 'gold',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
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
