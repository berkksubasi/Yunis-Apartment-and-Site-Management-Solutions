import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import axios from 'axios';

interface QRCodeResultModalProps {
  visible: boolean;
  visitorStatus: string | null;
  qrData: string;
  onClose: () => void;
}

export default function QRCodeResultModal({
  visible,
  visitorStatus,
  qrData,
  onClose,
}: QRCodeResultModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [alreadyEntered, setAlreadyEntered] = useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        'https://aparthus-api.vercel.app/api/qr-routes/visitor-entry',
        {
          qrCode: qrData,
          status: 'confirmed',
        }
      );

      if (response.data.alreadyEntered) {
        setAlreadyEntered(true);
        Alert.alert('Uyarı', 'Bu ziyaretçi zaten giriş yaptı', [
          { text: 'Tamam', onPress: onClose },
        ]);
      } else {
        setTimeout(() => {
          Alert.alert('Başarılı', 'Ziyaretçi girişi başarıyla kaydedildi', [
            { text: 'Tamam', onPress: onClose },
          ]);
        }, 3000);
      }
    } catch (error) {
      Alert.alert('Hata', 'Ziyaretçi giriş kaydı başarısız');
      console.error('Ziyaretçi giriş kaydı başarısız:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal visible={visible} transparent={true} animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={visitorStatus === 'Kayıtlı Ziyaretçi' ? styles.registeredVisitor : styles.unknownVisitor}>
            {visitorStatus}
          </Text>
          {visitorStatus === 'Kayıtlı Ziyaretçi' && <Text style={styles.qrData}>{qrData}</Text>}

          {/* Onayla Butonu veya Loader */}
          {visitorStatus === 'Kayıtlı Ziyaretçi' && !alreadyEntered && (
            <TouchableOpacity
              style={[styles.confirmButton, isLoading && { backgroundColor: 'gray' }]}
              onPress={handleConfirm}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text style={styles.confirmButtonText}>Onayla</Text>
              )}
            </TouchableOpacity>
          )}

          {/* Kapat Butonu */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Kapat</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.7)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: 'white', padding: 20, borderRadius: 10, width: '80%', alignItems: 'center' },
  registeredVisitor: { fontSize: 24, color: 'green', fontWeight: 'bold', marginTop: 25 },
  unknownVisitor: { fontSize: 24, color: 'red', fontWeight: 'bold', marginTop: 25, marginBottom: 25 },
  qrData: { fontSize: 18, marginBottom: 25, color: 'black' },
  confirmButton: { backgroundColor: 'green', padding: 10, borderRadius: 5, marginBottom: 10, width: '100%' },
  confirmButtonText: { color: 'white', fontWeight: 'bold', textAlign: 'center' },
  closeButton: { backgroundColor: 'gold', padding: 10, borderRadius: 5, width: '100%' },
  closeButtonText: { color: 'black', fontWeight: 'bold', textAlign: 'center' },
});
