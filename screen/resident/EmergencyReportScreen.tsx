import React, { useState } from 'react';
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Dimensions, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export const EmergencyReportScreen = () => {
  const [emergencyType, setEmergencyType] = useState(''); 
  const [customEmergency, setCustomEmergency] = useState(''); 
  const [priorityLevel, setPriorityLevel] = useState(''); 
  const [description, setDescription] = useState(''); 

  const handleSendEmergencyReport = () => {
    if (emergencyType === '' || priorityLevel === '') {
      Alert.alert('Hata', 'Lütfen tüm zorunlu alanları doldurun.');
      return;
    }

    const emergencyReport = emergencyType === 'Diğer' ? customEmergency : emergencyType;
    const reportDetails = {
      type: emergencyReport,
      priority: priorityLevel,
      description: description,
    };

    Alert.alert('Başarılı', `Acil durum bildiriminiz başarıyla gönderildi`);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.container}>
          {/* Önem Seviyesi Kartı */}
          <View style={styles.card}>
            <Text style={styles.label}>Önem Seviyesi:</Text>
            <Picker
              selectedValue={priorityLevel}
              onValueChange={(itemValue) => setPriorityLevel(itemValue)}
            >
              <Picker.Item label="Yeşil Kod (Düşük)" value="Yeşil Kod" />
              <Picker.Item label="Sarı Kod (Orta)" value="Sarı Kod" />
              <Picker.Item label="Kırmızı Kod (Yüksek)" value="Kırmızı Kod" />
            </Picker>
          </View>

          {/* Acil Durum Tipi Kartı */}
          <View style={styles.card}>
            <Text style={styles.label}>Acil Durum Tipi:</Text>
            <Picker
              selectedValue={emergencyType}
              onValueChange={(itemValue) => setEmergencyType(itemValue)}
            >
              <Picker.Item label="Yangın" value="Yangın" />
              <Picker.Item label="Su Baskını" value="Su Baskını" />
              <Picker.Item label="Deprem" value="Deprem" />
              <Picker.Item label="Trafik Kazası" value="Trafik Kazası" />
              <Picker.Item label="Diğer" value="Diğer" />
            </Picker>

            {emergencyType === 'Diğer' && (
              <TextInput
                style={styles.input}
                placeholder="Acil durumu açıklayın"
                value={customEmergency}
                onChangeText={setCustomEmergency}
              />
            )}
          </View>

          {/* Acil Durum Açıklaması Kartı */}
          <View style={styles.card}>
            <Text style={styles.label}>Acil Durum Açıklaması:</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Acil durum hakkında daha fazla bilgi verin (Opsiyonel)"
              value={description}
              onChangeText={setDescription}
              multiline
            />
          </View>

          {/* Submit Button */}
          <View style={styles.buttonCard}>
            <TouchableOpacity style={styles.button} onPress={handleSendEmergencyReport}>
              <Text style={styles.buttonText}>Bildir</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white', 
    height: SCREEN_HEIGHT,
  },
  container: {
    flex: 1,
    justifyContent: 'space-evenly', 
    paddingHorizontal: 10,
    height: SCREEN_HEIGHT,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginVertical: 10,
    padding: 15, 
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  buttonCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '800',
    color: 'black', 
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: 'gold',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#FAFAFA',
    marginTop: 5,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  textArea: {
    height: 65,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: 'gold', 
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    width: '100%',
    shadowColor: 'gold',
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
