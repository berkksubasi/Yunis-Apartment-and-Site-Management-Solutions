import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image, Animated, FlatList } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import RNPickerSelect from 'react-native-picker-select';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const issueCategories = [
  { label: 'Asansör Arızası', value: 'elevator' },
  { label: 'Su Kesintisi', value: 'water' },
  { label: 'Elektrik Sorunu', value: 'electric' },
  { label: 'Isıtma Sorunu', value: 'heating' },
  { label: 'Temizlik', value: 'cleaning' },
];

type Issue = {
  _id: string;
  category: string;
  description: string;
  image?: string;
};

export const ReportIssueScreen = () => {
  const [issueCategory, setIssueCategory] = useState<string | null>(null);
  const [issueDescription, setIssueDescription] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [issues, setIssues] = useState<Issue[]>([]);
  const scaleAnim = new Animated.Value(1);

  useEffect(() => {
    const fetchIssues = async () => {
      console.log('Sorunlar yükleniyor...');
      try {
        const response = await axios.get('https://aparthus-api.vercel.app/api/issues/getAllIssues');
        if (response.status === 200) {
          setIssues(response.data.issues);
          console.log('Sorunlar başarıyla yüklendi:', response.data.issues);
        }
      } catch (error) {
        console.error('Sorunları yükleme sırasında hata oluştu:', error);
      }
    };

    fetchIssues();
  }, []);

  const handlePickImage = async () => {
    console.log('Resim seçici açılıyor...');
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setSelectedImage(result.assets[0].uri);
      console.log('Seçilen resim URI:', result.assets[0].uri);
    }
  };

  const handleReportIssue = async () => {
    console.log('Sorun bildiriliyor...');
    if (!issueCategory) {
      Alert.alert('Hata', 'Lütfen bir sorun kategorisi seçin.');
      console.log('Hata: Sorun kategorisi seçilmedi.');
      return;
    }

    if (!issueDescription.trim()) {
      Alert.alert('Hata', 'Lütfen sorunun açıklamasını girin.');
      console.log('Hata: Sorun açıklaması boş.');
      return;
    }

    try {
      // AsyncStorage'den residentId'yi dinamik olarak al
      const residentId = await AsyncStorage.getItem('residentId');
      console.log("Resident ID:", residentId);

      // ObjectId formatında olup olmadığını kontrol et
      if (!residentId || residentId.length !== 24) {
        Alert.alert('Hata', 'Geçerli bir kullanıcı kimliği bulunamadı. Lütfen tekrar oturum açın.');
        return;
      } 

      console.log('Sorun Kategorisi:', issueCategory);
      console.log('Sorun Açıklaması:', issueDescription);
      console.log('Seçilen Resim:', selectedImage ? selectedImage : 'Resim seçilmedi');

      const formData = new FormData();
      formData.append('residentId', residentId); // `residentId` eklendi
      formData.append('category', issueCategory);
      formData.append('description', issueDescription);

      if (selectedImage) {
        formData.append('image', {
          uri: selectedImage,
          type: 'image/jpeg',
          name: 'issue_image.jpg',
        } as any);
        console.log('Form verisine resim eklendi');
      }

      console.log('API isteği gönderiliyor...');
      const response = await axios.post('https://aparthus-api.vercel.app/api/issues/reportIssues', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      console.log('API yanıt durumu:', response.status);

      if (response.status === 201) {
        Alert.alert('Başarılı', 'Sorununuz başarıyla bildirildi.');
        setIssueCategory(null);
        setIssueDescription('');
        setSelectedImage(null);
        setIssues((prevIssues) => [...prevIssues, response.data.issue]);
        console.log('Sorun başarıyla bildirildi ve listeye eklendi.');
      } else {
        Alert.alert('Hata', 'Sorun bildirimi başarısız oldu. Lütfen tekrar deneyin.');
        console.log('API yanıt durumu başarısız:', response.status);
      }
    } catch (error: any) {
      Alert.alert('Hata', 'Sorun bildirimi sırasında bir hata oluştu. Lütfen tekrar deneyin.');
      console.error('Sorun bildirimi sırasında hata oluştu:', error);
      console.error('Hata Mesajı:', error.message);
      console.error('Hata Yanıt Verisi:', error.response ? error.response.data : 'Yanıt verisi yok');
      console.error('Hata Yapılandırması:', error.config);
    }
  };

  const onPressIn = () => {
    Animated.spring(scaleAnim, { toValue: 0.97, useNativeDriver: true }).start();
  };

  const onPressOut = () => {
    Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }).start();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Sorun Bildir</Text>
        <Text style={styles.pickerLabel}>Sorun Kategorisi</Text>
        <RNPickerSelect
          onValueChange={(value) => setIssueCategory(value)}
          placeholder={{ label: 'Kategori Seçin', value: null, color: '#9CA3AF' }}
          items={issueCategories}
          useNativeAndroidPickerStyle={false}
          style={{ inputAndroid: styles.pickerInput, inputIOS: styles.pickerInput, placeholder: { color: '#9CA3AF' } }}
          Icon={() => <Ionicons name="chevron-down" size={24} color="#9CA3AF" style={styles.pickerIcon} />}
        />
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Sorun hakkında bilgi verin"
          value={issueDescription}
          onChangeText={setIssueDescription}
          multiline
        />
        <TouchableOpacity style={styles.imagePickerButton} onPress={handlePickImage} activeOpacity={0.8}>
          <Ionicons name="camera-outline" size={22} color="#3B82F6" style={styles.icon} />
          <Text style={styles.imagePickerText}>Fotoğraf Ekle</Text>
        </TouchableOpacity>
        {selectedImage && <Image source={{ uri: selectedImage }} style={styles.image} />}
        <Animated.View style={[styles.buttonContainer, { transform: [{ scale: scaleAnim }] }]}>
          <TouchableOpacity style={styles.button} onPress={handleReportIssue} onPressIn={onPressIn} onPressOut={onPressOut} activeOpacity={0.9}>
            <Text style={styles.buttonText}>Bildir</Text>
          </TouchableOpacity>
        </Animated.View>
        <FlatList
          data={issues}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.issueItem}>
              <Text style={styles.issueCategory}>{item.category}</Text>
              <Text style={styles.issueDescription}>{item.description}</Text>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f9fafb' },
  container: { flex: 1, paddingHorizontal: 20, justifyContent: 'center' },
  title: { fontSize: 26, fontWeight: 'bold', color: '#1f2937', textAlign: 'center', marginBottom: 20, letterSpacing: 0.5 },
  pickerLabel: { fontSize: 16, color: '#4B5563', marginBottom: 8 },
  pickerInput: { backgroundColor: '#ffffff', borderRadius: 12, borderColor: '#D1D5DB', borderWidth: 1, padding: 12, fontSize: 16, marginBottom: 20, color: '#1F2937' },
  pickerIcon: { right: 10, marginTop: 10, alignItems: 'flex-end' },
  input: { borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 12, padding: 15, fontSize: 16, backgroundColor: 'white', color: '#1F2937', marginBottom: 20 },
  textArea: { height: 100, textAlignVertical: 'top' },
  imagePickerButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#EFF6FF', paddingVertical: 12, paddingHorizontal: 15, borderRadius: 12, width: '100%', marginBottom: 20, shadowColor: '#93C5FD', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 3 },
  icon: { marginRight: 10 },
  imagePickerText: { color: '#3B82F6', fontSize: 16, fontWeight: '500' },
  image: { width: '100%', height: 200, borderRadius: 12, marginBottom: 20 },
  buttonContainer: { width: '100%', alignItems: 'center' },
  button: { backgroundColor: '#fdd700', paddingVertical: 15, borderRadius: 12, alignItems: 'center', width: '100%', shadowColor: '#3B82F6', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 4 },
  buttonText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 16 },
  issueItem: { padding: 15, backgroundColor: '#ffffff', borderRadius: 12, marginBottom: 15, borderColor: '#D1D5DB', borderWidth: 1 },
  issueCategory: { fontSize: 16, fontWeight: 'bold', color: '#1f2937', marginBottom: 5 },
  issueDescription: { fontSize: 14, color: '#4B5563' },
});

export default ReportIssueScreen;
