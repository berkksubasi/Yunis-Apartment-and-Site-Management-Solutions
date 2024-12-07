import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import axios from 'axios';
import Header from './components/Header';
import CameraSection from './components/CameraSection';
import QRCodeResultModal from './components/QRCodeResultModal';
import InputSection from './components/InputSection';
import { Camera } from 'expo-camera';

export default function QRCodeScannerScreen() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [qrData, setQrData] = useState<string>('');
  const [inputText, setInputText] = useState<string>('');
  const [visitorStatus, setVisitorStatus] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  React.useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    setScanned(true);
    setQrData(data);
    const isRegistered = await checkQRCode(data);
    setVisitorStatus(isRegistered ? "Kayıtlı Ziyaretçi" : "Bilinmeyen Ziyaretçi");
    setModalVisible(true);
  };

  const checkQRCode = async (qrCode: string): Promise<boolean> => {
    try {
      const response = await axios.post('https://aparthus-api.vercel.app/api/qr-routes/check-qr', { qrCode });
      return response.data.isRegistered;
    } catch (error) {
      console.error("QR kod kontrol edilirken hata oluştu:", error);
      return false;
    }
  };

  const saveQRCode = async () => {
    try {
      const response = await axios.post('https://aparthus-api.vercel.app/api/qr-routes/save-qr', {
        qrCode: inputText,
        visitorName: 'Ziyaretçi Adı'
      });
      console.log('QR kod kaydedildi:', response.data.message);
    } catch (error) {
      console.error("QR kod kaydedilemedi:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Ziyaretçi Yönetim Paneli" />
      <CameraSection scanned={scanned} onScanned={handleBarCodeScanned} />
      <QRCodeResultModal
        visible={modalVisible}
        visitorStatus={visitorStatus}
        qrData={qrData}
        onClose={() => setModalVisible(false)}
      />
      <InputSection inputText={inputText} setInputText={setInputText} saveQRCode={saveQRCode} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF', padding: 16 }
});
