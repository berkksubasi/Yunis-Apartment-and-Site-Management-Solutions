import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Resident } from '../types';

interface ResidentCardProps {
  resident: Resident;
  onRequestPayment: (resident: Resident) => void;
  onShowDetails: (resident: Resident) => void;
  onCall: (phoneNumber: string) => void;
}

export const ResidentCard: React.FC<ResidentCardProps> = ({ resident, onRequestPayment, onShowDetails, onCall }) => {
  // Aidat talebi fonksiyonu
  const handleRequestPayment = () => {
    console.log('handleRequestPayment çağrıldı');
    console.log(`Aidat talep edilecek kişi: ${resident.firstName} ${resident.lastName}, Borç: ${resident.amountDue} ₺`);
    Alert.alert(
      'Aidat Talebi',
      `${resident.firstName} ${resident.lastName}'den ${resident.amountDue} ₺ aidat talep ediliyor.`,
      [
        { text: 'İptal', style: 'cancel' },
        { text: 'Onayla', onPress: () => {
            console.log('Aidat talebi onaylandı');
            onRequestPayment(resident); // Aidat talebi onaylandığında onRequestPayment fonksiyonunu çağır
          }
        },
      ]
    );
  };

  // Arama fonksiyonu
  const handleCall = () => {
    console.log('handleCall çağrıldı');
    console.log(`Aranacak kişi: ${resident.firstName} ${resident.lastName}, Telefon Numarası: ${resident.contactNumber}`);
    Alert.alert(
      'Arama',
      `${resident.firstName} ${resident.lastName}'yi aramak istediğinize emin misiniz?`,
      [
        { text: 'İptal', style: 'cancel' },
        { text: 'Ara', onPress: () => {
            console.log('Arama onaylandı');
            onCall(resident.contactNumber); // Arama onaylandığında onCall fonksiyonunu çağır
          }
        },
      ]
    );
  };

  return (
    <View style={styles.cardContainer}>
      {/* Resident detaylarını göstermek için tıklanabilir alan */}
      <TouchableOpacity onPress={() => {
        console.log('Detaylar gösteriliyor:', resident);
        onShowDetails(resident); // Detayları göstermek için onShowDetails fonksiyonunu çağır
      }} style={styles.detailsContainer}>
        <Text style={styles.residentText} numberOfLines={1}>
          {resident.firstName} {resident.lastName} {/* Resident ismi ve soyismi */}
        </Text>
        <Text style={resident.hasPaid ? styles.paidText : styles.unpaidText}>
          {resident.amountDue} ₺ {resident.hasPaid && <Text style={styles.paidLabel}>(Ödendi)</Text>} {/* Borç ve ödeme durumu */}
        </Text>
      </TouchableOpacity>

      {/* Butonlar için alan */}
      <View style={styles.buttonsContainer}>
        {/* Eğer aidat ödenmemişse ve borç varsa aidat talep et butonunu göster */}
        {!resident.hasPaid && resident.amountDue > 0 && (
          <TouchableOpacity onPress={handleRequestPayment} style={styles.requestButton}>
            <Text style={styles.requestButtonText}>Aidat Talep Et</Text>
          </TouchableOpacity>
        )}

        {/* Arama butonu */}
        <TouchableOpacity onPress={handleCall} style={styles.callButton}>
          <Text style={styles.callButtonText}>Ara</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    marginVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailsContainer: {
    flex: 1,
    marginRight: 10,
  },
  residentText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  paidLabel: {
    color: 'green',
  },
  paidText: {
    fontSize: 16,
    color: 'green',
    fontWeight: 'bold',
  },
  unpaidText: {
    fontSize: 16,
    color: 'red',
    fontWeight: 'bold',
  },
  buttonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  requestButton: {
    backgroundColor: 'black',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginRight: 10,
    minWidth: 100,
    alignItems: 'center',
  },
  requestButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  callButton: {
    backgroundColor: 'green',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    minWidth: 60,
    alignItems: 'center',
  },
  callButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
