import React, { useState } from 'react';
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import DateTimePicker from '@react-native-community/datetimepicker';

export const AnnouncementScreen = ({ onAddAnnouncement }: { onAddAnnouncement: (announcement: any) => void }) => {
  const [announcement, setAnnouncement] = useState('');
  const [selectedFile, setSelectedFile] = useState<{ name: string; uri: string } | null>(null);
  const [date, setDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [block, setBlock] = useState('');

  const handleFilePick = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({
        type: '*/*', 
      });

      if (res.type === 'success') { 
        setSelectedFile({
          name: res.name || 'Seçilen dosya', 
          uri: res.uri, 
        });
      } else {
        console.log('İşlem iptal edildi.');
      }
    } catch (err) {
      console.error('Error during document pick:', err);
    }
  };

  const handlePostAnnouncement = () => {
    if (announcement.trim() === '') {
      Alert.alert('Hata', 'Lütfen bir duyuru metni girin.');
      return;
    }

    onAddAnnouncement({
      text: announcement,
      file: selectedFile,
      date: date,
      block: block,
    });

    Alert.alert('Başarılı', 'Duyuru başarıyla gönderildi.');
    setAnnouncement('');
    setSelectedFile(null);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Image
          source={require('../../assets/icon.png')}
          style={styles.logo}
        />
        <TextInput
          style={styles.input}
          placeholder="Duyuru metnini buraya yazın"
          value={announcement}
          onChangeText={setAnnouncement}
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
              if (selectedDate) {
                setDate(selectedDate);
              }
            }}
          />
        )}

        <TextInput
          style={styles.input}
          placeholder="Duyurunun gönderileceği blok (örn. A, B, Tümü)"
          value={block}
          onChangeText={setBlock}
        />

        <TouchableOpacity style={styles.button} onPress={handlePostAnnouncement}>
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
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
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
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 1,
  },
  fileButton: {
    width: '100%',
    backgroundColor: '#1E88E5', 
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#1E88E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  dateButton: {
    width: '100%',
    backgroundColor: 'gold',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: 'gold',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  button: {
    width: '100%',
    backgroundColor: '#FF7043',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#6200EE',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
