import React from 'react';
import { CameraView } from 'expo-camera';
import { StyleSheet } from 'react-native';

interface CameraSectionProps {
  scanned: boolean;
  onScanned: (event: { data: string }) => void;
}

export default function CameraSection({ scanned, onScanned }: CameraSectionProps) {
  return (
    <CameraView
      style={styles.camera}
      onBarcodeScanned={scanned ? undefined : onScanned}
    />
  );
}

const styles = StyleSheet.create({
  camera: { width: '100%', height: 250, borderRadius: 15, overflow: 'hidden', marginVertical: 20 },
});
