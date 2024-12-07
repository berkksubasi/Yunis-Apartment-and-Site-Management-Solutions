import React from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import QRCode from 'react-native-qrcode-svg';

interface InputSectionProps {
  inputText: string;
  setInputText: (text: string) => void;
  saveQRCode: () => void;
}

export default function InputSection({ inputText, setInputText, saveQRCode }: InputSectionProps) {
  return (
    <View>
      <View style={styles.qrContainer}>
        {inputText ? (
          <QRCode value={inputText} size={200} />
        ) : (
          <Text style={styles.qrPlaceholder}>Enter text to generate QR code</Text>
        )}
      </View>

      <View style={styles.inputContainer}>
        <Ionicons name="text" size={24} color="#FFD700" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Enter Text to Generate QR Code"
          placeholderTextColor="#8A8A8A"
          onChangeText={setInputText}
          value={inputText}
        />
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={saveQRCode}>
        <Text style={styles.saveText}>Save</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  qrContainer: { alignItems: 'center', marginVertical: 20 },
  qrPlaceholder: { fontSize: 16, color: '#888888', textAlign: 'center' },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginVertical: 16,
    height: 50,
  },
  icon: { marginRight: 10 },
  input: { flex: 1, fontSize: 16, color: '#333333' },
  saveButton: { backgroundColor: '#FFD700', paddingVertical: 10, borderRadius: 10, alignItems: 'center', marginVertical: 10 },
  saveText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
});
