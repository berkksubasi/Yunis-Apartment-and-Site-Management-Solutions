import React, { useState } from 'react';
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import DateTimePicker from '@react-native-community/datetimepicker';

interface AnnouncementScreenProps {
  onAddAnnouncement: (announcement: string) => void; // Props tanımlıyoruz
}

export const AnnouncementScreen: React.FC<AnnouncementScreenProps> = ({ onAddAnnouncement }) => {
  const [message, setMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState<{ name: string; uri: string } | null>(null);
  const [date, setDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [block, setBlock] = useState('');

  const handleFilePick = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({ type: '*/*' });
      if (res.type === 'success') {
        setSelectedFile({ name: res.name || 'Seçilen dosya', uri: res.uri });
      } else {
        console.log('İşlem iptal edildi.');
      }
    } catch (err) {
      console.error('Error during document pick:', err);
    }
  };

  const handleSendAnnouncement = async () => {
    if (message.trim() === '') {
      Alert.alert('Hata', 'Lütfen bir duyuru metni girin.');
      return;
    }

    // onAddAnnouncement prop'unu çağırıyoruz
    onAddAnnouncement(message);

    try {
      const response = await fetch('https://yunis-api.vercel.app/api/announcements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          block,
          scheduledAt: date.toISOString(),
          mediaUrl: selectedFile?.uri || null,
        }),
      });

      if (response.ok) {
        Alert.alert('Başarılı', 'Duyuru başarıyla gönderildi!');
        setMessage('');
        setSelectedFile(null);
      } else {
        Alert.alert('Hata', 'Duyuru gönderilirken bir hata oluştu.');
      }
    } catch (error) {
      Alert.alert('Bağlantı Hatası', 'Sunucuya ulaşılamadı.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Image source={require('../../assets/icon.png')} style={styles.logo} />
        <TextInput
          style={styles.input}
          placeholder="Duyuru metnini buraya yazın"
          value={message}
          onChangeText={setMessage}
          multiline
        />

        <TouchableOpacity style={styles.fileButton} onPress={handleFilePick}>
          <Text style={styles.buttonText}>
            {selectedFile ? `Seçilen Dosya: ${selectedFile.name}` : 'PDF/Resim Ekle'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.dateButton} onPress={() => setShowDatePicker(true)}>
          <Text style={styles.buttonText}>Tarih ve Saat Seç</Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="datetime"
            display="default"
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) setDate(selectedDate);
            }}
          />
        )}

        <TextInput
          style={styles.input}
          placeholder="Duyurunun gönderileceği blok (örn. A, B, Tümü)"
          value={block}
          onChangeText={setBlock}
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
    justifyContent: 'center',  
    alignItems: 'center',  
    paddingHorizontal: 20,
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 30,
    alignSelf: 'center',
    resizeMode: 'contain',
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#E0E0E0',
    borderWidth: 1,
    borderRadius: 12, 
    padding: 15,
    fontSize: 16,
    marginBottom: 20,
    backgroundColor: '#FAFAFA',
  },
  fileButton: {
    width: '100%',
    backgroundColor: '#1E88E5', 
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  dateButton: {
    width: '100%',
    backgroundColor: 'gold',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  button: {
    width: '100%',
    backgroundColor: '#FF7043',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
