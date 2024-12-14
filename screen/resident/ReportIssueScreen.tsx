import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Animated, FlatList, ActivityIndicator } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const issueCategories = [
  { label: 'Asansör Arızası', value: 'Asansör Arızası' },
  { label: 'Su Kesintisi', value: 'Su Kesintisi' },
  { label: 'Elektrik Sorunu', value: 'Elektrik Sorunu' },
  { label: 'Isıtma Sorunu', value: 'Isıtma Sorunu' },
  { label: 'Temizlik', value: 'Temizlik' },
];

const issueStatuses = [
  { label: 'Açık', value: 'Açık' },
  { label: 'Çözüldü', value: 'Çözüldü' },
];

type Issue = {
  _id?: string;
  id?: string;
  title: string;
  category: string;
  description: string;
  status: string;
};

export const ReportIssueScreen = () => {
  const [issueCategory, setIssueCategory] = useState<string | null>(null);
  const [issueDescription, setIssueDescription] = useState('');
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const scaleAnim = new Animated.Value(1);

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const response = await axios.get('https://aparthus-api.vercel.app/api/issues/getAllIssues');
        if (response.status === 200) {
          const issueData = Array.isArray(response.data) ? response.data : [];
          setIssues(issueData);
        }
      } catch (error) {
        console.error('Sorunları yükleme sırasında hata oluştu:', error);
      }
    };

    fetchIssues();
  }, []);

  const handleReportIssue = async () => {
    if (!issueCategory || !issueDescription.trim()) {
      Alert.alert('Hata', 'Lütfen tüm alanları doldurun.');
      return;
    }

    setLoading(true);
    try {
      const residentId = await AsyncStorage.getItem('residentId');
      if (!residentId || residentId.length !== 24) {
        Alert.alert('Hata', 'Geçerli bir kullanıcı kimliği bulunamadı.');
        setLoading(false);
        return;
      }

      const requestData = {
        residentId,
        title: 'Sorun Başlığı',
        category: issueCategory,
        description: issueDescription,
        status: 'Açık',
      };

      const response = await axios.post(
        'https://aparthus-api.vercel.app/api/issues/reportIssues',
        requestData
      );

      if (response.status === 201) {
        const newIssue = response.data.issue || requestData;
        Alert.alert('Başarılı', 'Sorununuz başarıyla bildirildi.');
        setIssueCategory(null);
        setIssueDescription('');
        setIssues((prevIssues) => [...prevIssues, newIssue]);
      }
    } catch (error: any) {
      Alert.alert('Hata', 'Sorun bildirimi sırasında bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteIssue = async (id: string) => {
    setLoading(true);
    try {
      await axios.delete(`https://aparthus-api.vercel.app/api/issues/deleteIssue/${id}`);
      setIssues((prevIssues) => prevIssues.filter((issue) => issue._id !== id));
      Alert.alert('Başarılı', 'Sorun başarıyla silindi.');
    } catch (error) {
      Alert.alert('Hata', 'Sorun silinirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    setLoading(true);
    try {
      const updatedIssue = await axios.put(`https://aparthus-api.vercel.app/api/issues/updateIssue/${id}`, { status: newStatus });
      setIssues((prevIssues) =>
        prevIssues.map((issue) =>
          issue._id === id ? { ...issue, status: updatedIssue.data.status } : issue
        )
      );
      Alert.alert('Başarılı', 'Durum başarıyla güncellendi.');
    } catch (error) {
      Alert.alert('Hata', 'Durum güncellenirken bir hata oluştu.');
    } finally {
      setLoading(false);
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
        <Animated.View style={[styles.buttonContainer, { transform: [{ scale: scaleAnim }] }]}>
          <TouchableOpacity style={styles.button} onPress={handleReportIssue} onPressIn={onPressIn} onPressOut={onPressOut} activeOpacity={0.9}>
            <Text style={styles.buttonText}>Bildir</Text>
          </TouchableOpacity>
        </Animated.View>
        {loading ? (
          <ActivityIndicator size="large" color="#FFA500" />
        ) : issues.length === 0 ? (
          <Text style={styles.emptyText}>Henüz bildirilen bir sorun yok.</Text>
        ) : (
          <FlatList
            data={issues}
            keyExtractor={(item, index) => item._id || item.id || index.toString()}
            renderItem={({ item }) => (
              <View style={styles.issueItem}>
                <Text style={styles.issueCategory}>{item.category}</Text>
                <Text style={styles.issueDescription}>{item.description}</Text>
                <RNPickerSelect
                  onValueChange={(value) => handleUpdateStatus(item._id || '', value || '')}
                  value={item.status}
                  items={issueStatuses}
                  useNativeAndroidPickerStyle={false}
                  style={{
                    inputAndroid: styles.statusPicker,
                    inputIOS: styles.statusPicker,
                  }}
                />
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDeleteIssue(item._id || '')}
                >
                  <Text style={styles.deleteButtonText}>Sil</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        )}
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
  buttonContainer: { width: '100%', alignItems: 'center' },
  button: { backgroundColor: '#fdd700', paddingVertical: 15, borderRadius: 12, alignItems: 'center', width: '100%', shadowColor: '#3B82F6', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 4 },
  buttonText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 16 },
  emptyText: { textAlign: 'center', fontSize: 16, color: '#9CA3AF', marginTop: 20 },
  issueItem: { padding: 15, backgroundColor: '#ffffff', borderRadius: 12, marginTop: 10, marginBottom: 15, borderColor: '#D1D5DB', borderWidth: 1 },
  issueCategory: { fontSize: 16, fontWeight: 'bold', color: '#1f2937', marginBottom: 5 },
  issueDescription: { fontSize: 14, color: '#4B5563' },
  statusPicker: {backgroundColor: '#f3f4f6',borderRadius: 8,marginVertical: 8,paddingHorizontal: 12,paddingVertical: 8,},
  deleteButton: {backgroundColor: '#ef4444',borderRadius: 8,paddingVertical: 8,marginTop: 8,alignItems: 'center',},
  deleteButtonText: {color: 'white',fontWeight: 'bold',},
});

export default ReportIssueScreen;
