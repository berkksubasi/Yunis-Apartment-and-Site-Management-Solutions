import React, { FC, useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { CommonProps } from './CommonProps';

interface ResidentFormProps extends CommonProps {
  onSubmit: (data: Record<string, any>) => void;
}

const ResidentForm: FC<ResidentFormProps> = ({
  username,
  email,
  password,
  setUsername,
  setEmail,
  setPassword,
  onSubmit,
}) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [siteName, setSiteName] = useState('');
  const [block, setBlock] = useState('');
  const [apartmentNumber, setApartmentNumber] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [yoneticiId, setYoneticiId] = useState('');
  const [loading, setLoading] = useState(false);

  // Yönetici ID'ye göre site adını getir
  const fetchSiteName = async () => {
    if (!yoneticiId.trim()) {
      Alert.alert('Hata', 'Yönetici ID boş olamaz.');
      return;
    }

    try {
      setLoading(true); // Loader başlat
      const response = await fetch(`https://aparthus-api.vercel.app/api/users/${yoneticiId}`);
      const data = await response.json();
      if (response.ok) {
        setSiteName(data.siteName); // Site adını state'e set et
        Alert.alert('Başarılı', 'Site adı başarıyla alındı.');
      } else {
        Alert.alert('Hata', 'Geçerli bir Yönetici ID girin.');
        setSiteName('');
      }
    } catch (error) {
      console.error('Site adı getirme hatası:', error);
      Alert.alert('Hata', 'Site adı alınırken bir hata oluştu.');
      setSiteName('');
    } finally {
      setLoading(false); // Loader durdur
    }
  };

  const handleSubmit = () => {
    if (!firstName || !lastName || !siteName || !apartmentNumber || !contactNumber || !yoneticiId) {
      Alert.alert('Hata', 'Lütfen tüm alanları doldurun.');
      return;
    }

    const formattedBlock = block.trim() === '' ? undefined : block;

    onSubmit({
      firstName,
      lastName,
      siteName,
      block: formattedBlock,
      apartmentNumber,
      contactNumber,
      yoneticiId,
    });
  };

  return (
    <View style={styles.container}>
      <TextInput style={styles.input} placeholder="Kullanıcı Adı" value={username} onChangeText={setUsername} />
      <TextInput style={styles.input} placeholder="Ad" value={firstName} onChangeText={setFirstName} />
      <TextInput style={styles.input} placeholder="Soyad" value={lastName} onChangeText={setLastName} />
      <TextInput style={styles.input} placeholder="E-posta" keyboardType="email-address" value={email} onChangeText={setEmail} />
      <TextInput style={styles.input} placeholder="Telefon Numarası" keyboardType="phone-pad" value={contactNumber} onChangeText={setContactNumber} />
      <TextInput style={styles.input} placeholder="Şifre" secureTextEntry value={password} onChangeText={setPassword} />
      <TextInput style={styles.input} placeholder="Yönetici ID" value={yoneticiId} onChangeText={setYoneticiId} />
      
      <TouchableOpacity style={styles.checkButton} onPress={fetchSiteName} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.checkButtonText}>Kontrol Et</Text>}
      </TouchableOpacity>
      
      <TextInput style={styles.input} placeholder="Apartman Adı (Otomatik)" value={siteName} editable={false} />
      <TextInput style={styles.input} placeholder="Daire Numarası" keyboardType="numeric" value={apartmentNumber} onChangeText={setApartmentNumber} />
      <TextInput style={styles.input} placeholder="Blok" value={block} onChangeText={setBlock} />

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitText}>Kaydol</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ResidentForm;

const styles = StyleSheet.create({
  container: { padding: 20, width: '100%', backgroundColor: '#fff', borderRadius: 8, shadowColor: '#000', shadowOpacity: 0.1, elevation: 3 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 15 },
  checkButton: { backgroundColor: '#2196F3', padding: 12, borderRadius: 8, alignItems: 'center', marginBottom: 15 },
  checkButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  submitButton: { backgroundColor: '#32CD32', padding: 15, borderRadius: 8, alignItems: 'center' },
  submitText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
