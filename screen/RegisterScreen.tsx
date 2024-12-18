import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import YoneticiForm from '../components/forms/YoneticiForm';
import ResidentForm from '../components/forms/ResidentForm';
import { RootStackParamList } from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RegisterScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [role, setRole] = useState<string>('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const validateForm = () => {
    if (!username || !email || !password) {
      Alert.alert('Hata', 'Kullanıcı adı, e-posta ve şifre alanları zorunludur.');
      return false;
    }
    if (!email.includes('@') || !email.includes('.')) {
      Alert.alert('Hata', 'Geçerli bir e-posta adresi girin.');
      return false;
    }
    if (password.length < 6) {
      Alert.alert('Hata', 'Şifre en az 6 karakter olmalıdır.');
      return false;
    }
    return true;
  };

  const handleRegister = async (roleSpecificData: Record<string, any>) => {
    console.log('Selected Role:', role);
  
    if (!validateForm()) return;
  
    const endpoint =
      role === 'yonetici'
        ? 'https://aparthus-api.vercel.app/api/users/register'
        : 'https://aparthus-api.vercel.app/api/residents/register';
  
    const data = {
      username,
      email,
      password,
      phoneNumber,
      role,
      ...roleSpecificData,
    };
  
    try {
      console.log('Gönderilen Veriler:', data);
  
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
  
      const responseData = await response.json();
      console.log('API Yanıtı:', responseData);
  
      if (response.status === 201) {
        Alert.alert('Başarılı', `${role === 'yonetici' ? 'Yönetici' : 'Sakin'} başarıyla kaydedildi.`);
        navigation.navigate(role === 'yonetici' ? 'YoneticiHome' : 'ResidentHome');
      } else {
        Alert.alert('Hata', responseData.message || 'Kayıt işlemi başarısız.');
      }
    } catch (error) {
      console.error('Fetch Hatası:', error);
      Alert.alert('Hata', 'Sunucu bağlantısı sırasında bir hata oluştu.');
    }
  };
  

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Kaydol</Text>
      <Text style={styles.subtitle}>Rolünüzü seçin ve kayıt işlemini tamamlayın.</Text>

      <View style={styles.roleSelection}>
        <TouchableOpacity
          style={[styles.roleCard, role === 'yonetici' && styles.activeRoleCard]}
          onPress={() => setRole('yonetici')}
        >
          <Text style={styles.roleTitle}>Yönetici</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.roleCard, role === 'resident' && styles.activeRoleCard]}
          onPress={() => setRole('resident')}
        >
          <Text style={styles.roleTitle}>Sakin</Text>
        </TouchableOpacity>
      </View>

      {role === 'yonetici' ? (
        <YoneticiForm
          username={username}
          email={email}
          phoneNumber={phoneNumber}
          password={password}
          setUsername={setUsername}
          setEmail={setEmail}
          setPhoneNumber={setPhoneNumber}
          setPassword={setPassword}
          onSubmit={handleRegister}
        />
      ) : (
        <ResidentForm
          username={username}
          email={email}
          phoneNumber={phoneNumber}
          password={password}
          setUsername={setUsername}
          setEmail={setEmail}
          setPhoneNumber={setPhoneNumber}
          setPassword={setPassword}
          onSubmit={handleRegister}
          yoneticiId={''}
        />
      )}
    </ScrollView>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#FFD200', padding: 20, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#333', marginTop: 20, marginBottom: 10, textAlign: 'center' },
  subtitle: { fontSize: 16, color: '#666', textAlign: 'center', marginBottom: 20 },
  roleSelection: { flexDirection: 'row', marginBottom: 20 },
  roleCard: { flex: 1, backgroundColor: '#FFF', padding: 15, margin: 10, borderRadius: 10, alignItems: 'center', elevation: 3 },
  activeRoleCard: { borderColor: '#2196F3', backgroundColor: '#E3F2FD' },
  roleTitle: { fontSize: 18, fontWeight: 'bold' },
});
