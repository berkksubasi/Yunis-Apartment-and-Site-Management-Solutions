import React, { useState } from 'react';
import { LoginButton } from '../components/LoginButton';
import { View, TextInput, StyleSheet, Alert, Image } from 'react-native';
import { ADMIN_PASSWORD, ADMIN_USERNAME, RESIDENT_PASSWORD, RESIDENT_USERNAME, SECURITY_PASSWORD, SECURITY_USERNAME } from '@env';


interface LoginScreenProps {
  setUserType: (userType: 'admin' | 'resident' | 'security') => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ setUserType }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Çevresel değişkenler ile kullanıcı doğrulama
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      setUserType('admin'); // Admin olarak giriş yap
    } else if (username === RESIDENT_USERNAME && password === RESIDENT_PASSWORD) {
      setUserType('resident'); // Resident (sakin) olarak giriş yap
    } else if (username === SECURITY_USERNAME && password === SECURITY_PASSWORD) {
      setUserType('security'); // Güvenlik olarak giriş yap
    } else {
      Alert.alert('Hatalı giriş', 'Lütfen geçerli bir kullanıcı adı ve şifre girin.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.overlay} />
      <Image 
        source={require('../assets/logo.png')} 
        style={styles.logo} 
      />
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
        <LoginButton title="Giriş Yap" onPress={handleLogin} />
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
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.06)', 
  },
  logo: {
    width: 400,
    height: 200,
    marginBottom: 20,
    alignSelf: 'center',
    justifyContent: 'center',
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
