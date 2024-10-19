import React, { useState } from 'react';
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert } from 'react-native';

interface Resident {
  id: string;
  firstName: string;
  lastName: string;
  siteName: string;
  block: string;
  apartmentNo: number;
  phoneNumber: string;
}

export const ManageUsersScreen = () => {
  const [residents, setResidents] = useState<Resident[]>([
    { id: '1', firstName: 'Ahmet', lastName: 'Yılmaz', siteName: 'Aytur Sitesi', block: 'A', apartmentNo: 12, phoneNumber: '5551234567' },
    { id: '2', firstName: 'Ayşe', lastName: 'Demir', siteName: 'Aytur Sitesi', block: 'B', apartmentNo: 8, phoneNumber: '5559876543' },
    { id: '3', firstName: 'Mehmet', lastName: 'Kaya', siteName: 'Aytur Sitesi', block: 'C', apartmentNo: 22, phoneNumber: '5551112233' },
  ]);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [siteName, setSiteName] = useState('');
  const [block, setBlock] = useState('');
  const [apartmentNo, setApartmentNo] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [editingResident, setEditingResident] = useState<Resident | null>(null);

  const addResident = () => {
    if (firstName.trim() === '' || lastName.trim() === '' || block.trim() === '' || apartmentNo === '' || phoneNumber.trim() === '') {
      Alert.alert('Hata', 'Tüm alanları doldurmanız gerekmektedir.');
      return;
    }

    if (editingResident) {
      setResidents(residents.map((resident) =>
        resident.id === editingResident.id
          ? { ...resident, firstName, lastName, siteName, block, apartmentNo: Number(apartmentNo), phoneNumber }
          : resident
      ));
      setEditingResident(null);
    } else {
      const newResident = {
        id: Math.random().toString(36).substring(7),
        firstName,
        lastName,
        siteName,
        block,
        apartmentNo: Number(apartmentNo),
        phoneNumber,
      };
      setResidents([...residents, newResident]);
    }

    setFirstName('');
    setLastName('');
    setSiteName('');
    setBlock('');
    setApartmentNo('');
    setPhoneNumber('');
  };

  const editResident = (resident: Resident) => {
    setFirstName(resident.firstName);
    setLastName(resident.lastName);
    setSiteName(resident.siteName);
    setBlock(resident.block);
    setApartmentNo(resident.apartmentNo.toString());
    setPhoneNumber(resident.phoneNumber);
    setEditingResident(resident);
  };

  const deleteResident = (id: string) => {
    Alert.alert(
      'Sakin Sil',
      'Bu sakini silmek istediğinizden emin misiniz?',
      [
        { text: 'Hayır', style: 'cancel' },
        { text: 'Evet', onPress: () => setResidents(residents.filter((resident) => resident.id !== id)) },
      ]
    );
  };

  const renderResident = ({ item }: { item: Resident }) => (
    <View style={styles.residentItem}>
      <View style={styles.residentDetails}>
        <Text style={styles.residentText}>Site: {item.siteName}</Text>
        <Text style={styles.residentText}>
          {item.firstName} {item.lastName}
        </Text>
        <Text style={styles.residentText}>Blok: {item.block}, Daire No: {item.apartmentNo}</Text>
        <Text style={styles.residentText}>Telefon: {item.phoneNumber}</Text>
      </View>
      <View style={styles.actionButtons}>
        <TouchableOpacity onPress={() => editResident(item)} style={styles.editButton}>
          <Text style={styles.actionButtonText}>Düzenle</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => deleteResident(item.id)} style={styles.deleteButton}>
          <Text style={styles.actionButtonText}>Sil</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Ad"
          value={firstName}
          onChangeText={setFirstName}
          placeholderTextColor="#999"
        />
        <TextInput
          style={styles.input}
          placeholder="Soyad"
          value={lastName}
          onChangeText={setLastName}
          placeholderTextColor="#999"
        />
        <TextInput
          style={styles.input}
          placeholder="Apartman & Site Adı"
          value={siteName}
          onChangeText={setSiteName}
          placeholderTextColor="#999"
        />
        <TextInput
          style={styles.input}
          placeholder="Blok"
          value={block}
          onChangeText={setBlock}
          placeholderTextColor="#999"
        />
        <TextInput
          style={styles.input}
          placeholder="Daire No"
          value={apartmentNo}
          onChangeText={setApartmentNo}
          keyboardType="numeric"
          placeholderTextColor="#999"
        />
        <TextInput
          style={styles.input}
          placeholder="Telefon Numarası"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="phone-pad"
          placeholderTextColor="#999"
        />

        <TouchableOpacity onPress={addResident} style={styles.addButton}>
          <Text style={styles.addButtonText}>{editingResident ? 'Güncelle' : 'Sakin Ekle'}</Text>
        </TouchableOpacity>

        <FlatList
          data={residents}
          renderItem={renderResident}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={<Text style={styles.emptyText}>Henüz eklenmiş sakin yok.</Text>}
        />
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
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: 10,
  },
  input: {
    height: 50,
    borderColor: 'silver',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: '#F5F5F5',
    fontSize: 16,
    color: '#333',
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 1,
  },
  addButton: {
    backgroundColor: '#007BFF',  
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#007BFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  addButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  residentItem: {
    backgroundColor: 'white',
    padding: 15,
    marginVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'silver',
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  residentDetails: {
    flex: 1,
  },
  residentText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
  },
  editButton: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 8,
    marginRight: 5,
  },
  deleteButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 8,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 16,
    marginTop: 20,
  },
});
