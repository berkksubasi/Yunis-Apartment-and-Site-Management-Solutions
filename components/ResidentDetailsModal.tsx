import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Resident } from '../types';

interface ResidentDetailsModalProps {
  resident: Resident | null;
  isVisible: boolean;
  onClose: () => void;
  onCall: (phoneNumber: string) => void;
}

export const ResidentDetailsModal: React.FC<ResidentDetailsModalProps> = ({ resident, isVisible, onClose, onCall }) => {
  if (!resident) return null;

  return (
    <Modal visible={isVisible} transparent={true} animationType="fade">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>
            {resident.firstName} {resident.lastName}
          </Text>
          <Text style={styles.modalText}>Site: {resident.siteName}</Text>
          <Text style={styles.modalText}>Blok: {resident.block}</Text>
          <Text style={styles.modalText}>Daire No: {resident.apartmentNumber}</Text>
          <Text style={styles.modalText}>Ödeme Durumu: {resident.hasPaid ? 'Ödendi' : 'Ödenmedi'}</Text>
          <Text style={styles.modalText}>Son Ödeme Tarihi: {resident.dueDate}</Text>
          <TouchableOpacity onPress={() => onCall(resident.contactNumber)}>
            <Text style={styles.modalText}>İletişim: {resident.contactNumber}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Kapat</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  modalText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  closeButton: {
    backgroundColor: 'black',
    padding: 10,
    borderRadius: 5,
    borderColor: 'gray',
    marginTop: 20,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
