import React, { useState, useEffect } from 'react';
import { SafeAreaView, Text, StyleSheet, View, TouchableOpacity, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';

export const QRCodeScannerScreen = () => {
  const [hasPermission, requestPermission] = useCameraPermissions(); // Kamera izni kontrolü
  const [scanned, setScanned] = useState(false);

  // QR kod tarama işlemi
  const handleBarCodeScanned = ({ data }: { data: string }) => {
    setScanned(true);
    Alert.alert('QR Kod Taranan Veri', `Ziyaretçi Bilgisi: ${data}`, [
      { text: 'Tamam', onPress: () => setScanned(false) }, // Yeniden taramak için
    ]);
  };

  // Kamera izni yükleniyor
  if (!hasPermission) {
    return <Text>Kamera izni yükleniyor...</Text>;
  }

  // Kamera izni verilmediyse
  if (!hasPermission.granted) {
    return (
      <View style={styles.container}>
        <Text>Kamerayı kullanabilmek için izin gerekiyor.</Text>
        <TouchableOpacity onPress={requestPermission} style={styles.button}>
          <Text style={styles.buttonText}>İzin Ver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.cameraContainer}>
        <CameraView
          style={StyleSheet.absoluteFillObject}
          barcodeScannerSettings={{
            barcodeTypes: ['qr'], // Sadece QR kodları tara
          }}
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned} // Taranan veri
        />
      </View>
      {scanned && (
        <TouchableOpacity style={styles.button} onPress={() => setScanned(false)}>
          <Text style={styles.buttonText}>Yeniden Tara</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: 'black',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});
