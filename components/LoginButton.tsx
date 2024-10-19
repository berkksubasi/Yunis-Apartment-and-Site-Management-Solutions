import React from 'react';
import { TouchableOpacity, Text, StyleSheet, GestureResponderEvent } from 'react-native';

interface LoginButtonProps {
  onPress: (event: GestureResponderEvent) => void;
  title: string;
}

// LoginButton bileşeni props olarak LoginButtonProps kullanıyor
export const LoginButton: React.FC<LoginButtonProps> = ({ onPress, title }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'gold',
    paddingVertical: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'silver',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
