import React, { useState } from 'react';
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';

export const SendNotificationScreen = () => {
  const [message, setMessage] = useState('');
  const [block, setBlock] = useState('');
  const [scheduledAt, setScheduledAt] = useState('');

  const handleSendAnnouncement = async () => {
    try {
      console.log("Duyuru gönderiliyor:", { message, block, scheduledAt }); // İstek öncesi log
      const response = await fetch('https://aparthus-api.vercel.app/api/announcements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          block,
          scheduledAt,
          mediaUrl: null,
        }),
      });
  
      if (response.ok) {
        console.log('Başarılı yanıt:', await response.json()); // Başarılı yanıt log
        Alert.alert('Başarılı', 'Duyuru başarıyla gönderildi!');
      } else {
        console.log('Başarısız yanıt:', await response.text()); // Başarısız yanıt log
        Alert.alert('Hata', 'Duyuru gönderilirken bir hata oluştu.');
      }
    } catch (error) {
      console.log('Bağlantı hatası:', error); // Hata log
      Alert.alert('Bağlantı Hatası', 'Sunucuya ulaşılamadı.');
    }
  };
  

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Duyuru Yap</Text>
        <TextInput
          style={styles.input}
          placeholder="Duyuru metnini buraya yazın"
          value={message}
          onChangeText={setMessage}
        />
        <TextInput
          style={styles.input}
          placeholder="Duyurunun gönderileceği blok (örn. A, B, Tümü)"
          value={block}
          onChangeText={setBlock}
        />
        <TextInput
          style={styles.input}
          placeholder="Tarih ve Saat (YYYY-MM-DD)"
          value={scheduledAt}
          onChangeText={setScheduledAt}
        />
        <TouchableOpacity style={styles.button} onPress={handleSendAnnouncement}>
          <Text style={styles.buttonText}>🔔 Duyuru Gönder</Text>
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
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
    marginBottom: 20,
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#FF7043',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
