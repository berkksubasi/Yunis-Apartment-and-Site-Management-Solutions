import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, StyleSheet, FlatList, Alert } from 'react-native';
import { Transactions } from '../../types';

const BankTransactionsScreen = () => {
  const [transactions, setTransactions] = useState<Transactions[]>([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch('https://aparthus-api.vercel.app/api/transactions'); // API adresinizi kontrol edin.
        const contentType = response.headers.get('content-type');

        if (response.ok && contentType?.includes('application/json')) {
          const data = await response.json();

          // Gelen verinin doğruluğunu kontrol et
          if (Array.isArray(data) && data.every(item => item.id && item.date && item.description && item.amount !== undefined)) {
            setTransactions(data);
          } else {
            console.log('Gelen veri formatı beklenmiyor:', data);
            Alert.alert('Hata', 'Sunucudan beklenmeyen veri formatı alındı.');
          }
        } else {
          const errorText = await response.text();
          console.log('Beklenmeyen yanıt:', errorText);
          Alert.alert('Hata', 'Sunucudan beklenmeyen veri formatı alındı.');
        }
      } catch (error) {
        console.error('Sunucuya ulaşılamadı:', error);
        Alert.alert('Bağlantı hatası', 'Sunucuya ulaşılamıyor.');
      }
    };

    fetchTransactions();
  }, []);

  const renderTransaction = ({ item }: { item: Transactions }) => (
    <View style={styles.transactionItem}>
      <Text style={styles.transactionDate}>{item.date}</Text>
      <Text style={styles.transactionDescription}>{item.description}</Text>
      <Text
        style={[
          styles.transactionAmount,
          { color: item.amount >= 0 ? 'green' : 'red' }, // Dinamik renk
        ]}
      >
        {item.amount >= 0 ? `+${item.amount} ₺` : `${item.amount} ₺`}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Banka Hareketleri</Text>
        <FlatList
          data={transactions}
          renderItem={renderTransaction}
          keyExtractor={(item) => item.id} // Unique anahtar
          ListEmptyComponent={
            <Text style={styles.emptyText}>Henüz banka hareketi yok.</Text>
          }
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'black',
    textAlign: 'center',
  },
  transactionItem: {
    padding: 15,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    marginVertical: 5,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  transactionDate: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  transactionDescription: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
  },
  transactionAmount: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 16,
    marginTop: 20,
  },
});

export default BankTransactionsScreen;
