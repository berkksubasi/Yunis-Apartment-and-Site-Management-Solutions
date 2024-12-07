import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Resident {
  amountDue: any;
  dueDate: string | number | Date;
  _id: string;
  firstName: string;
  lastName: string;
  siteName: string;
  block: string;
  apartmentNumber: number;
  contactNumber: string;
  username: string;
  email: string;
  password: string;
}

export const ManageUsersScreen = () => {
  const [residents, setResidents] = useState<Resident[]>([]);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [siteName, setSiteName] = useState('');
  const [block, setBlock] = useState('');
  const [apartmentNumber, setApartmentNumber] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [amountDue, setAmountDue] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [editingResident, setEditingResident] = useState<Resident | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isRoleLoaded, setIsRoleLoaded] = useState(false);

  useEffect(() => {
    const getUserRole = async () => {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        setUserRole(user.role);
      }
      setIsRoleLoaded(true);
      console.log('Kullanıcı rol:', userRole);
    };

    const fetchResidents = async () => {
      try {
        const response = await fetch('https://aparthus-api.vercel.app/api/residents');
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

    getUserRole();
    fetchResidents();
  }, []);

  const deleteResident = async (id: string) => {
    try {
      const response = await fetch(`https://aparthus-api.vercel.app/api/residents/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setResidents(residents.filter((resident) => resident._id !== id));
        Alert.alert('Başarılı', 'Sakin başarıyla silindi!');
      } else {
        const errorText = await response.text();
        console.log('Beklenmeyen yanıt:', errorText);
        Alert.alert('Hata', 'Sakin silinirken bir sorun oluştu.');
      }
    } catch (error) {
      console.error('Sunucuya ulaşılamadı:', error);
      Alert.alert('Bağlantı hatası', 'Sunucuya ulaşılamıyor.');
    }
  };

  const addOrUpdateResident = async () => {
    if (
      firstName.trim() === '' ||
      lastName.trim() === '' ||
      username.trim() === '' ||
      block.trim() === '' ||
      apartmentNumber === '' ||
      contactNumber.trim() === '' ||
      amountDue === '' ||
      dueDate === '' ||
      email.trim() === '' ||
      password.trim() === ''
    ) {
      Alert.alert('Hata', 'Tüm alanları doldurmanız gerekmektedir.');
      return;
    }

    try {
      const residentData = {
        firstName,
        lastName,
        siteName,
        block,
        apartmentNumber: Number(apartmentNumber),
        contactNumber,
        amountDue: Number(amountDue),
        dueDate: new Date(dueDate),
        username,
        email,
        password,
      };

      const method = editingResident ? 'PUT' : 'POST';
      const url = editingResident
        ? `https://aparthus-api.vercel.app/api/residents/${editingResident._id}`
        : 'https://aparthus-api.vercel.app/api/residents/register';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(residentData),
      });

      if (response.ok) {
        const updatedResidents = editingResident
          ? residents.map((resident) =>
            resident._id === editingResident._id
              ? { ...resident, ...residentData }
              : resident
          )
          : [...residents, await response.json()];

        setResidents(updatedResidents);
        resetForm();
        Alert.alert('Başarılı', `Sakin başarıyla ${editingResident ? 'güncellendi' : 'eklendi'}!`);
      } else {
        const errorText = await response.text();
        console.log('Hata:', errorText);
        Alert.alert('Hata', 'Sakin işlemi sırasında bir hata oluştu.');
      }
    } catch (error) {
      console.error('Sunucuya ulaşılamadı:', error);
      Alert.alert('Bağlantı hatası', 'Sunucuya ulaşılamıyor.');
    }
  };

  const resetForm = () => {
    setFirstName('');
    setLastName('');
    setSiteName('');
    setBlock('');
    setApartmentNumber('');
    setContactNumber('');
    setAmountDue('');
    setDueDate('');
    setUsername('');
    setEmail('');
    setPassword('');
    setEditingResident(null);
  };

  const editResident = (resident: Resident) => {
    setFirstName(resident.firstName || '');
    setLastName(resident.lastName || '');
    setSiteName(resident.siteName || '');
    setBlock(resident.block || '');
    setApartmentNumber(resident.apartmentNumber ? resident.apartmentNumber.toString() : '');
    setContactNumber(resident.contactNumber || '');
    setAmountDue(resident.amountDue ? resident.amountDue.toString() : '');
    setDueDate(resident.dueDate ? new Date(resident.dueDate).toISOString().split('T')[0] : '');
    setUsername(resident.username || '');
    setEmail(resident.email || '');
    setPassword('');
    setEditingResident(resident);
  };

  const renderResident = ({ item }: { item: Resident }) => (
    <View style={styles.residentItem}>
      <View style={styles.residentDetails}>
        <Text style={styles.residentText}>Site: {item.siteName}</Text>
        <Text style={styles.residentText}>Sakin: {item.firstName} {item.lastName}</Text>
        <Text style={styles.residentText}>Blok: {item.block}</Text>
        <Text style={styles.residentText}>Daire No: {item.apartmentNumber}</Text>
        <Text style={styles.residentText}>Telefon: {item.contactNumber}</Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity onPress={() => editResident(item)} style={styles.editButton}>
          <Text style={styles.editButtonText}>Düzenle</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => deleteResident(item._id)} style={styles.deleteButton}>
          <Text style={styles.deleteButtonText}>Sil</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (!isRoleLoaded) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Yükleniyor...</Text>
      </View>
    );
  }

  if (userRole !== 'admin') {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Bu işlemi yapmaya yetkiniz yok.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <TextInput
            style={styles.input}
            placeholder="Kullanıcı Adı"
            value={username}
            onChangeText={setUsername}
            placeholderTextColor="#999"
          />
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
            value={apartmentNumber}
            onChangeText={setApartmentNumber}
            keyboardType="numeric"
            placeholderTextColor="#999"
          />
          <TextInput
            style={styles.input}
            placeholder="Telefon Numarası"
            value={contactNumber}
            onChangeText={setContactNumber}
            keyboardType="phone-pad"
            placeholderTextColor="#999"
          />
          <TextInput
            style={styles.input}
            placeholder="Ödenecek Tutar"
            value={amountDue}
            onChangeText={setAmountDue}
            keyboardType="numeric"
            placeholderTextColor="#999"
          />
          <TextInput
            style={styles.input}
            placeholder="Son Ödeme Tarihi (YYYY-MM-DD)"
            value={dueDate}
            onChangeText={setDueDate}
            placeholderTextColor="#999"
          />
          <TextInput
            style={styles.input}
            placeholder="E-posta"
            value={email}
            onChangeText={setEmail}
            placeholderTextColor="#999"
          />
          <TextInput
            style={styles.input}
            placeholder="Şifre"
            value={password}
            onChangeText={setPassword}
            placeholderTextColor="#999"
            secureTextEntry
          />
        </ScrollView>

        <TouchableOpacity onPress={addOrUpdateResident} style={styles.addButton}>
          <Text style={styles.addButtonText}>{editingResident ? 'Güncelle' : 'Sakin Ekle'}</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
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
  scrollContainer: {
    paddingBottom: 100,
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
    backgroundColor: '#FFD700',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#FFD700',
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
  actions: {
    flexDirection: 'row',
  },
  editButton: {
    backgroundColor: '#28A745',
    padding: 10,
    borderRadius: 8,
    marginRight: 10,
  },
  editButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: '#DC3545',
    padding: 10,
    borderRadius: 8,
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 16,
    marginTop: 20,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    fontWeight: 'bold',
  },
});
