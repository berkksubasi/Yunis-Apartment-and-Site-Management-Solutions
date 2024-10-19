import React, { useState } from 'react';
import { SafeAreaView, View, Text, FlatList, TouchableOpacity, TextInput, StyleSheet, Alert } from 'react-native';

interface Visitor {
  id: string;
  name: string;
  purpose: string;
  resident: string;  // Ziyaret edilen site sakini
  entryTime: string;
  exitTime?: string;
}

export const VisitorManagementScreen = () => {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [visitorName, setVisitorName] = useState('');
  const [purpose, setPurpose] = useState('');
  const [residentName, setResidentName] = useState('');
  const [scanningQR, setScanningQR] = useState(false);

  const addVisitor = () => {
    if (visitorName.trim() === '' || purpose.trim() === '' || residentName.trim() === '') {
      Alert.alert('Hata', 'Tüm alanları doldurmanız gerekiyor.');
      return;
    }

    const newVisitor: Visitor = {
      id: Math.random().toString(),  // Unique ID generator
      name: visitorName,
      purpose: purpose,
      resident: residentName,
      entryTime: new Date().toLocaleString(),
    };

    setVisitors([...visitors, newVisitor]);
    setVisitorName('');
    setPurpose('');
    setResidentName('');
    Alert.alert('Başarılı', 'Ziyaretçi başarıyla kaydedildi.');
  };

  const markExit = (id: string) => {
    const updatedVisitors = visitors.map(visitor => {
      if (visitor.id === id) {
        return { ...visitor, exitTime: new Date().toLocaleString() };
      }
      return visitor;
    });
    setVisitors(updatedVisitors);
  };

  const renderVisitor = ({ item }: { item: Visitor }) => (
    <View style={styles.visitorCard}>
      <Text style={styles.visitorText}>Ziyaretçi: {item.name}</Text>
      <Text style={styles.visitorText}>Amaç: {item.purpose}</Text>
      <Text style={styles.visitorText}>Ziyaret Edilen: {item.resident}</Text>
      <Text style={styles.visitorText}>Giriş Saati: {item.entryTime}</Text>
      {item.exitTime ? (
        <Text style={styles.visitorText}>Çıkış Saati: {item.exitTime}</Text>
      ) : (
        <TouchableOpacity style={styles.exitButton} onPress={() => markExit(item.id)}>
          <Text style={styles.exitButtonText}>Çıkışı Kaydet</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Ziyaretçi Takip Sistemi</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Ziyaretçi Adı"
          value={visitorName}
          onChangeText={setVisitorName}
        />
        <TextInput
          style={styles.input}
          placeholder="Ziyaret Amacı"
          value={purpose}
          onChangeText={setPurpose}
        />
        <TextInput
          style={styles.input}
          placeholder="Ziyaret Edilen Site Sakini"
          value={residentName}
          onChangeText={setResidentName}
        />

        <TouchableOpacity style={styles.addButton} onPress={addVisitor}>
          <Text style={styles.buttonText}>Ziyaretçiyi Kaydet</Text>
        </TouchableOpacity>

        <FlatList
          data={visitors}
          renderItem={renderVisitor}
          keyExtractor={(item) => item.id}
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
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginBottom: 15,
  },
  addButton: {
    backgroundColor: 'black',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  visitorCard: {
    backgroundColor: '#f8f8f8',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  visitorText: {
    fontSize: 16,
    marginBottom: 5,
  },
  exitButton: {
    marginTop: 10,
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
  },
  exitButtonText: {
    color: 'white',
    textAlign: 'center',
  },
});
