import React, { FC, useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { CommonProps } from './CommonProps';

interface YoneticiFormProps extends CommonProps {
  onSubmit: (data: Record<string, any>) => void;
}

const YoneticiForm: FC<YoneticiFormProps> = ({
  username,
  email,
  phoneNumber,
  password,
  setUsername,
  setEmail,
  setPhoneNumber,
  setPassword,
  onSubmit,
}) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [siteName, setSiteName] = useState('');
  const [block, setBlock] = useState('');
  const [dueAmount, setDueAmount] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [iban, setIban] = useState('');

  const validateForm = () => {
    if (!firstName || !lastName || !siteName || !dueAmount || !dueDate || !iban) {
      Alert.alert('Hata', 'Tüm zorunlu alanları doldurun.');
      return false;
    }

    if (!/^\d+(\.\d{1,2})?$/.test(dueAmount)) {
      Alert.alert('Hata', 'Aidat tutarı geçerli bir sayı olmalıdır.');
      return false;
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(dueDate)) {
      Alert.alert('Hata', 'Son ödeme tarihi YYYY-MM-DD formatında olmalıdır.');
      return false;
    }

    if (!/^[A-Z]{2}\d{2}[A-Z0-9]{1,30}$/.test(iban)) {
      Alert.alert('Hata', 'Geçerli bir IBAN formatı girin.');
      return false;
    }

    return true;
  };

  const handleSubmit = () => {
    onSubmit({
      username,
      firstName, 
      lastName, 
      siteName,
      block,
      dueAmount: Number(dueAmount),
      dueDate,
      IBAN: iban,
    });
  };  
  
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Kullanıcı Adı"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Ad"
        value={firstName}
        onChangeText={setFirstName}
      />
      <TextInput
        style={styles.input}
        placeholder="Soyad"
        value={lastName}
        onChangeText={setLastName}
      />
      <TextInput
        style={styles.input}
        placeholder="E-posta"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Telefon"
        keyboardType="phone-pad"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
      />
      <TextInput
        style={styles.input}
        placeholder="Şifre"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="Apartman Adı"
        value={siteName}
        onChangeText={setSiteName}
      />
      <TextInput
        style={styles.input}
        placeholder="Blok (Opsiyonel)"
        value={block}
        onChangeText={setBlock}
      />
      <TextInput
        style={styles.input}
        placeholder="Aidat Tutarı"
        keyboardType="numeric"
        value={dueAmount}
        onChangeText={setDueAmount}
      />
      <TextInput
        style={styles.input}
        placeholder="Son Ödeme Tarihi (YYYY-MM-DD)"
        value={dueDate}
        onChangeText={setDueDate}
      />
      <TextInput
        style={styles.input}
        placeholder="IBAN"
        value={iban}
        onChangeText={setIban}
      />
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitText}>Kaydol</Text>
      </TouchableOpacity>
    </View>
  );
};

export default YoneticiForm;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 20,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  submitButton: {
    backgroundColor: '#32CD32',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  submitText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
