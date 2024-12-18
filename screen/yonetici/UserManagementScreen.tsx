import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, StyleSheet, FlatList, Alert, Modal, TouchableOpacity, Image } from 'react-native';
import { Resident } from '../../types';
import ResidentDetailsScreen from './ResidentDetailsScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const UserManagementScreen = () => {
  const [residents, setResidents] = useState<Resident[]>([]);
  const [selectedResident, setSelectedResident] = useState<Resident | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const fetchResidents = async () => {
      try {
        // Token'ı AsyncStorage'den al
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          Alert.alert('Hata', 'Yetkilendirme hatası: Token bulunamadı.');
          return;
        }

        const response = await fetch('https://aparthus-api.vercel.app/api/residents/yonetici-residents', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, 
          },
        });

        const contentType = response.headers.get('content-type');

        if (response.ok && contentType?.includes('application/json')) {
          const data = await response.json();
          setResidents(data); 
        } else {
          const errorText = await response.text();
          console.log('Beklenmeyen yanıt:', errorText);
          Alert.alert('Hata', 'Sunucudan beklenmeyen veri formatı alındı.');
        }
      } catch (error) {
        console.error('Sunucuya ulaşılamadı:', error);
        Alert.alert('Bağlantı hatası', 'Sunucuya ulaşılamıyor.');
      }
    };

    fetchResidents();
  }, []);
  const renderResident = ({ item }: { item: Resident }) => (
    <TouchableOpacity
      style={styles.residentItem}
      onPress={() => {
        setSelectedResident(item);
        setModalVisible(true);
      }}
    >
      <View style={styles.residentInfo}>
        <Image
          source={{ uri: 'https://via.placeholder.com/150' }} 
          style={styles.residentImage}
        />
        <View style={styles.residentDetails}>
          <Text style={styles.residentName}>{item.firstName} {item.lastName}</Text>
          <Text style={styles.residentDetailsText}>Blok: {item.block}, Daire No: {item.apartmentNumber}</Text>
          <Text style={styles.residentContact}>Telefon: {item.contactNumber}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Sakinler</Text>
        <FlatList
          data={residents}
          renderItem={renderResident}
          keyExtractor={(item) => item._id}
          ListEmptyComponent={<Text style={styles.emptyText}>Henüz eklenmiş sakin yok.</Text>}
        />
        {selectedResident && (
          <Modal
            animationType="slide"
            transparent={false}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(!modalVisible);
            }}
          >
            <ResidentDetailsScreen resident={selectedResident} onClose={() => setModalVisible(false)} />
          </Modal>
        )}
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
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'black',
    textAlign: 'center',
  },
  residentItem: {
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 12,
    marginVertical: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  residentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  residentImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  residentDetails: {
    flex: 1,
  },
  residentName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },
  residentDetailsText: {
    fontSize: 16,
    color: '#333',
  },
  residentContact: {
    fontSize: 14,
    color: 'green',
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 16,
    marginTop: 20,
  },
});
