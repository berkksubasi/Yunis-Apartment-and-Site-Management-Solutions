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
  const handleRequestPayment = () => {
    Alert.alert(
      'Aidat Talebi',
      `${resident.firstName} ${resident.lastName}'den ${resident.amountDue} ₺ aidat talep ediliyor.`,
      [
        { text: 'İptal', style: 'cancel' },
        { text: 'Onayla', onPress: () => onRequestPayment(resident) },
      ]
    );
  };

  const handleCall = () => {
    Alert.alert(
      'Arama',
      `${resident.firstName} ${resident.lastName}'yi aramak istediğinize emin misiniz?`,
      [
        { text: 'İptal', style: 'cancel' },
        { text: 'Ara', onPress: () => onCall(resident.contactNumber) },
      ]
    );
  };

  return (
    <View style={styles.cardContainer}>
      <TouchableOpacity onPress={() => onShowDetails(resident)}>
        <Text style={styles.residentText}>
          {resident.firstName} {resident.lastName}
        </Text>
        <Text style={resident.hasPaid ? styles.paidText : styles.unpaidText}>
          {resident.amountDue} ₺ {resident.hasPaid && <Text style={styles.paidLabel}>(Ödendi)</Text>}
        </Text>
      </TouchableOpacity>

      {!resident.hasPaid && (
        <TouchableOpacity onPress={handleRequestPayment} style={styles.requestButton}>
          <Text style={styles.requestButtonText}>Aidat Talep Et</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity onPress={handleCall} style={styles.callButton}>
        <Text style={styles.callButtonText}>Ara</Text>
      </TouchableOpacity>
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
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  residentText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
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
  requestButton: {
    backgroundColor: 'black',
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  requestButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  callButton: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
  },
  callButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
