import * as DocumentPicker from 'expo-document-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AnnouncementScreenProps {
  onAddAnnouncement: (announcement: string) => void; // Duyuru eklemek için kullanılan bir prop
}

export const AnnouncementScreen: React.FC<AnnouncementScreenProps> = ({ onAddAnnouncement }) => {
  const [message, setMessage] = useState(''); // Duyuru mesajı için state
  const [selectedFile, setSelectedFile] = useState<{ name: string; uri: string } | null>(null); // Seçilen dosya için state
  const [date, setDate] = useState<Date>(new Date()); // Tarih ve saat için state
  const [showDatePicker, setShowDatePicker] = useState(false); // Tarih seçici görünürlüğü için state
  const [block, setBlock] = useState(''); // Duyurunun gönderileceği blok bilgisi için state
  const [username, setUsername] = useState<string | null>(null); // Kullanıcı adı için state

  // AsyncStorage'dan kullanıcı bilgilerini al
  useEffect(() => {
    const getUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          const user = JSON.parse(userData);
          if (user.username) {
            setUsername(user.username);
            console.log('Kullanıcı adı ayarlandı:', user.username);
          } else {
            console.log('Kullanıcı adı bulunamadı.');
          }
        } else {
          console.log('Kullanıcı verileri bulunamadı.');
        }
      } catch (error) {
        console.error('Kullanıcı verileri alınamadı:', error);
      }
    };

    getUserData();
  }, []);

  // Dosya seçme işlemi
  const handleFilePick = async () => {
    console.log('Dosya seçme işlemi başlatıldı.');
    try {
      const res = await DocumentPicker.getDocumentAsync({ type: '*/*' }); // Herhangi bir türde dosya seç
      if (res.type === 'success') {
        console.log('Dosya başarıyla seçildi:', res.name);
        setSelectedFile({ name: res.name || 'Seçilen dosya', uri: res.uri }); // Dosya bilgilerini state'e kaydet
      } else {
        console.log('İşlem iptal edildi.');
      }
    } catch (err) {
      console.error('Belge seçme sırasında hata oluştu:', err);
    }
  };

  // Duyuru gönderme işlemi
  const handleSendAnnouncement = async () => {
    console.log('Duyuru gönderme işlemi başlatıldı.');
    if (message.trim() === '') {
      console.log('Hata: Duyuru metni boş.');
      Alert.alert('Hata', 'Lütfen bir duyuru metni girin.'); // Duyuru mesajı boşsa hata göster
      return;
    }

    if (!block.trim()) {
      console.log('Hata: Blok bilgisi boş.');
      Alert.alert('Hata', 'Lütfen bir blok bilgisi girin.'); // Blok bilgisi boşsa hata göster
      return;
    }

    // onAddAnnouncement prop'unu çağırıyoruz
    console.log('onAddAnnouncement çağrılıyor.');
    onAddAnnouncement(message);

    try {
      console.log('Duyuru API çağrısı başlatılıyor.');
      // Duyuruyu API'ye gönder
      const response = await fetch('https://aparthus-api.vercel.app/api/announcements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          block,
          scheduledAt: date.toISOString(), // Tarihi ISO formatında gönder
          mediaUrl: selectedFile?.uri || null, // Seçilen dosyanın URI'sini gönder
        }),
      });

      if (response.ok) {
        console.log('Duyuru başarıyla gönderildi.');
        Alert.alert('Başarılı', 'Duyuru başarıyla gönderildi!'); // Başarılı gönderim mesajı
        setMessage(''); // Duyuru mesajını sıfırla
        setSelectedFile(null); // Seçilen dosyayı sıfırla
        setBlock(''); // Blok bilgisini sıfırla
      } else {
        const errorResponse = await response.text();
        console.error('Duyuru gönderme hatası:', errorResponse);
        Alert.alert('Hata', 'Duyuru gönderilirken bir hata oluştu. Endpoint doğru değil!.'); // API hatası durumunda mesaj göster
      }
    } catch (error) {
      console.error('Bağlantı Hatası:', error);
      Alert.alert('Bağlantı Hatası', 'Sunucuya ulaşılamadı.'); // Bağlantı hatası durumunda mesaj göster
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Image source={require('../../assets/icon.png')} style={styles.logo} />
        {/* Kullanıcıya hoşgeldiniz mesajı */}
        {username && <Text style={styles.welcomeText}>Merhaba, {username}!</Text>}
        {/* Duyuru metni giriş alanı */}
        <TextInput
          style={styles.input}
          placeholder="Duyuru metnini buraya yazın"
          value={message}
          onChangeText={(text) => {
            console.log('Duyuru metni güncelleniyor:', text);
            setMessage(text); // Duyuru metnini güncelle
          }}
          multiline
        />

        {/* Dosya Ekle Butonu */}
        <TouchableOpacity style={styles.fileButton} onPress={handleFilePick}>
          <Text style={styles.buttonText}>
            {selectedFile ? `Seçilen Dosya: ${selectedFile.name}` : 'PDF/Resim Ekle'}
          </Text>
        </TouchableOpacity>

        {/* Tarih ve Saat Seçimi */}
        <TouchableOpacity style={styles.dateButton} onPress={() => {
          console.log('Tarih ve saat seçimi açılıyor.');
          setShowDatePicker(true); // Tarih ve saat seçici aç
        }}>
          <Text style={styles.buttonText}>Tarih ve Saat Seç</Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="datetime"
            display="default"
            onChange={(event, selectedDate) => {
              setShowDatePicker(false); // Tarih seçici kapat
              if (selectedDate) {
                console.log('Tarih ve saat seçildi:', selectedDate.toISOString());
                setDate(selectedDate); // Seçilen tarihi güncelle
              }
            }}
          />
        )}

        {/* Blok Bilgisi Giriş Alanı */}
        <TextInput
          style={styles.input}
          placeholder="Duyurunun gönderileceği blok (örn. A, B, Tümü)"
          value={block}
          onChangeText={(text) => {
            console.log('Blok bilgisi güncelleniyor:', text);
            setBlock(text); // Blok bilgisini güncelle
          }}
        />

        {/* Duyuru Gönder Butonu */}
        <TouchableOpacity style={styles.button} onPress={handleSendAnnouncement}>
          <Text style={styles.buttonText}>🔔 Duyuru Gönder</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// Stil dosyaları
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  fileButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    width: '100%',
    alignItems: 'center',
  },
  dateButton: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    width: '100%',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#ffc107',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
