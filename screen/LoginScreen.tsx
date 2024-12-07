import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Alert, Image, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackNavigationProp } from '@react-navigation/stack';
import { LoginButton } from '../components/LoginButton';
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
    console.log('handleLogin çağrıldı');
    setLoading(true);
    console.log('Loading durumu true olarak ayarlandı');

    if (!usernameOrEmail || !password) {
      console.log('Kullanıcı adı veya e-posta ve şifre gereklidir');
      Alert.alert('Hata', 'Kullanıcı adı veya e-posta ve şifre gereklidir.');
      setLoading(false);
      console.log('Loading durumu false olarak ayarlandı');
      return;
    }

    try {
      const isResident = !usernameOrEmail.includes('@');
      console.log(`isResident: ${isResident}`);

      const loginEndpoint = isResident
        ? 'https://aparthus-api.vercel.app/api/residents/login'
        : 'https://aparthus-api.vercel.app/api/login';
      console.log(`Login endpoint: ${loginEndpoint}`);

      const requestBody = isResident
        ? { username: usernameOrEmail, password }
        : { email: usernameOrEmail, password };
      console.log('Request Body:', requestBody);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(loginEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      console.log('Yanıt alındı');

      const contentType = response.headers.get("content-type");
      console.log(`Content type: ${contentType}`);

      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        console.log('Yanıt verisi:', data);

        if (response.ok) {
          const role = data.role || data.resident?.role;
          const residentId = data.resident?._id;
          console.log(`Rol: ${role}, Resident ID: ${residentId}`);

          if (role) {
            await AsyncStorage.setItem('user', JSON.stringify({ role }));
            console.log("Rol AsyncStorage'a kaydedildi");
            if (residentId) {
              await AsyncStorage.setItem('residentId', residentId);
              console.log("Resident ID AsyncStorage'a kaydedildi");
            }
            setrole(role);
            console.log(`Rol ayarlandı: ${role}`);

            if (role === 'resident') {
              console.log("ResidentHome'a yönlendiriliyor");
              navigation.navigate('ResidentHome');
            } else if (role === 'admin') {
              console.log("AdminHome'a yönlendiriliyor");
              navigation.navigate('AdminHome');
            } else if (role === 'security') {
              console.log("SecurityHome'a yönlendiriliyor");
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
      } else {
        console.error("Beklenmeyen yanıt formatı:", await response.text());
        Alert.alert("Hata", "Sunucudan geçersiz formatta yanıt alındı.");
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        console.error('İstek zaman aşımına uğradı:', error);
        Alert.alert('Bağlantı hatası', 'İstek zaman aşımına uğradı, lütfen tekrar deneyin.');
      } else {
        console.error('Bağlantı hatası:', error);
        Alert.alert('Bağlantı hatası', 'Sunucuya ulaşılamıyor.');
      }
    } finally {
      setLoading(false);
      console.log('Loading durumu false olarak ayarlandı');
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
