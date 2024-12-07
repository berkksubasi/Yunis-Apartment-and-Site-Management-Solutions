import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Header({ title }: { title: string }) {
  return (
    <View style={styles.header}>
      <Text style={styles.headerText}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 20 },
  headerText: { fontSize: 24, fontWeight: 'bold', color: '#333333' },
});
