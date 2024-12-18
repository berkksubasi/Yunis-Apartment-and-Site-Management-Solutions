import React from 'react';
import { SafeAreaView, View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

interface ResidentDetailsProps {
  resident: {
    firstName: string;
    lastName: string;
    amountDue: number;
    siteName: string;
    block: string;
    apartmentNumber: number;
    contactNumber: string;
    email: string;
    username: string;
  };
  onClose: () => void;
}

const ResidentDetailsScreen: React.FC<ResidentDetailsProps> = ({ resident, onClose }) => {
  // Bakiye rengini belirle
  const getBalanceColor = () => {
    if (resident.amountDue > 0) {
      return 'green'; // Pozitif bakiye için yeşil
    } else if (resident.amountDue < 0) {
      return 'red'; // Negatif bakiye için kırmızı
    }
    return 'black'; // Sıfır bakiye için siyah
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>Geri</Text>
        </TouchableOpacity>
        <Image
          source={{ uri: 'https://via.placeholder.com/150' }}
          style={styles.image}
        />
        <Text style={styles.name}>{resident.firstName} {resident.lastName}</Text>
        <Text style={styles.balance}>Bakiye: <Text style={{ color: getBalanceColor() }}>+{resident.amountDue} ₺</Text></Text>
        <TouchableOpacity style={styles.statementButton}>
          <Text style={styles.statementButtonText}>Hesap Ekstresi</Text>
        </TouchableOpacity>

        <View style={styles.detailsContainer}>
          <Text style={styles.detailTitle}>İlişkili Daire(ler)</Text>
          <Text style={styles.detailText}>{resident.siteName}, {resident.block} - {resident.apartmentNumber}</Text>
          <Text style={styles.detailTitle}>Telefon</Text>
          <Text style={styles.detailText}>{resident.contactNumber}</Text>
          <Text style={styles.detailTitle}>E-Posta Adresi</Text>
          <Text style={styles.detailText}>{resident.email}</Text>
          <Text style={styles.detailTitle}>Kullanıcı Adı</Text>
          <Text style={styles.detailText}>{resident.username}</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5', 
    padding: 20,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  closeButton: {
    alignSelf: 'flex-start',
    backgroundColor: 'gold', 
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    marginLeft: 10,
  },
  closeButtonText: {
    color: 'black', 
    fontWeight: 'bold',
    fontSize: 16,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
    borderWidth: 3,
    borderColor: '#FFD700', 
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  balance: {
    fontSize: 22,
    marginBottom: 20,
  },
  statementButton: {
    backgroundColor: '#FFD700',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25, 
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  statementButtonText: {
    color: '#000', 
    fontWeight: 'bold',
    fontSize: 16,
  },
  detailsContainer: {
    width: '100%',
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderColor: '#ddd', 
    marginTop: 20,
  },
  detailTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 15,
    color: '#333',
  },
  detailText: {
    fontSize: 16,
    color: '#555', 
    marginBottom: 10,
  },
});

export default ResidentDetailsScreen;
