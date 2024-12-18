import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Alert, Image, ActivityIndicator, Text } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackNavigationProp } from '@react-navigation/stack';
import { LoginButton } from '../components/LoginButton';
import { RootStackParamList } from '../types';

interface LoginScreenProps {
  setrole: (role: 'yonetici' | 'resident' | 'security') => void;
}

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

export const LoginScreen: React.FC<LoginScreenProps> = ({ setrole }) => {
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'yonetici' | 'resident'>('yonetici'); // Rol seçimi
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<LoginScreenNavigationProp>();

  const handleLogin = async () => {
    console.log('handleLogin çağrıldı');
    setLoading(true);
  
    if (!usernameOrEmail || !password) {
      Alert.alert('Hata', 'Kullanıcı adı veya e-posta ve şifre gereklidir.');
      setLoading(false);
      return;
    }
  
    try {
      const requestBody = { usernameOrEmail, password };
  
      console.log('Request Body:', requestBody);
  
      const response = await fetch('https://aparthus-api.vercel.app/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        console.error('Hatalı giriş:', data.message || 'Giriş başarısız.');
        Alert.alert('Hatalı giriş', data.message || 'Giriş başarısız.');
        return;
      }
  
      console.log('Yanıt verisi:', data);
  
      // Token ve kullanıcı bilgilerini AsyncStorage'e kaydet
      await AsyncStorage.multiSet([
        ['token', data.token],
        ['user', JSON.stringify(data.user)],
      ]);
  
      setrole(data.role);
      navigation.navigate(data.role === 'yonetici' ? 'YoneticiHome' : 'ResidentHome');
    } catch (error) {
      console.error('Bağlantı hatası:', error.message || error);
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
      <Text style={styles.label}>Rol Seçin:</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={role}
          onValueChange={(itemValue) => setRole(itemValue)}
          style={styles.pickerItem}
        >
          <Picker.Item label="Yönetici" value="yonetici" />
          <Picker.Item label="Sakin" value="resident" />
        </Picker>
      </View>


      <View style={styles.buttonContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#FFFFFF" />
        ) : (
          <LoginButton title="Giriş Yap" onPress={handleLogin} />
        )}
        <Text style={styles.registerText} onPress={() => navigation.navigate('Register')}>
          Kaydol
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: 'black', alignItems: 'center' },
  logo: { width: 400, height: 200, marginBottom: 20, resizeMode: 'contain' },
  input: { height: 50, borderColor: '#E0E0E0', borderWidth: 1, borderRadius: 8, paddingHorizontal: 15, marginBottom: 20, backgroundColor: '#FFFFFF', width: '100%', color: '#333' },
  pickerContainer: { width: '100%', height: 50, borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 8, overflow: 'hidden', marginBottom: 20, backgroundColor: '#FFFFFF', },
  pickerItem: { height: 50, borderColor: '#E0E0E0', borderWidth: 1, borderRadius: 8, paddingHorizontal: 15, marginBottom: 20, backgroundColor: '#FFFFFF', width: '100%', color: '#333' },
  label: { color: '#FFFFFF', fontSize: 12, paddingBlockStart: 10, marginBottom: 10, textAlign: 'left', alignSelf: 'flex-start' },
  buttonContainer: { width: '100%', alignSelf: 'center', marginTop: 20 },
  registerText: { marginTop: 15, color: '#FFFFFF', fontSize: 16, textAlign: 'center', textDecorationLine: 'underline' },
});
