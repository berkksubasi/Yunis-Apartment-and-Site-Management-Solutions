import React, { useState } from 'react';
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export const ReportIssueScreen = () => {
  const [issueDescription, setIssueDescription] = useState(''); // Sorun açıklaması
  const [selectedImage, setSelectedImage] = useState<string | null>(null); // Seçilen resim

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.uri);
    }
  };

  const handleReportIssue = () => {
    if (issueDescription === '') {
      Alert.alert('Hata', 'Lütfen sorunu açıklayın.');
      return;
    }

    Alert.alert('Başarılı', 'Sorununuz başarıyla bildirildi.');
    setIssueDescription('');
    setSelectedImage(null);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Sorun Bildir</Text>
        
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Sorun hakkında bilgi verin"
          value={issueDescription}
          onChangeText={setIssueDescription}
          multiline
        />

        <TouchableOpacity style={styles.imagePickerButton} onPress={handlePickImage}>
          <Text style={styles.buttonText}>Fotoğraf Ekle</Text>
        </TouchableOpacity>

        {selectedImage && <Image source={{ uri: selectedImage }} style={styles.image} />}

        <TouchableOpacity style={styles.button} onPress={handleReportIssue}>
          <Text style={styles.buttonText}>Bildir</Text>
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
    marginBottom: 20,
    color: 'black', 
  },
  input: {
    borderWidth: 1,
    borderColor: 'silver',
    borderRadius: 12, 
    padding: 15,
    fontSize: 16,
    marginBottom: 20,
    backgroundColor: '#FAFAFA',
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 1,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  imagePickerButton: {
    backgroundColor: '#03DAC6', 
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#03DAC6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  image: {
    width: '100%',
    height: 200,
    marginBottom: 20,
    borderRadius: 12,
  },
  button: {
    backgroundColor: '#1E88E5', 
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#1E88E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  buttonText: {
    color: 'white', 
    fontWeight: 'bold',
    fontSize: 16,
  },
});
