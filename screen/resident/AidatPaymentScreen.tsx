import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';

interface Payment {
  id: string;
  amount: number;
  status: string;
  dueDate: string;
}

export const AidatPaymentScreen = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const residentId = await AsyncStorage.getItem('residentId');
        if (!residentId) {
          Alert.alert('Hata', 'Kullanıcı ID bulunamadı.');
          setLoading(false);
          return;
        }
  
        const response = await fetch(`https://aparthus-api.vercel.app/api/residents/payments/${residentId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
  
        if (response.ok) {
          const data = await response.json();
          setPayments([{
            id: data._id,
            amount: data.amountDue,
            status: data.hasPaid ? 'Ödendi' : 'Ödenmedi',
            dueDate: new Date(data.dueDate).toLocaleDateString('tr-TR'),
          }]);
        } else {
          Alert.alert('Hata', 'Ödeme verileri alınırken bir sorun oluştu.');
        }
      } catch (error) {
        console.error('Veri çekme hatası:', error);
        Alert.alert('Hata', 'Veri çekme sırasında bir hata oluştu.');
      } finally {
        setLoading(false);
      }
    };
  
    fetchPayments();
  }, []);  

  const handlePay = async (id: string, amount: number) => {
    try {
      const residentId = await AsyncStorage.getItem('residentId');
      if (!residentId) {
        Alert.alert('Hata', 'Kullanıcı ID bulunamadı.');
        return;
      }

      const response = await fetch('https://aparthus-api.vercel.app/api/residents/payAidat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          residentId, 
          amount,
        }),
      });

      if (response.ok) {
        markAsPaid(id);
        Alert.alert('Başarılı', 'Aidat ödemeniz başarıyla yapıldı!');
      } else {
        Alert.alert('Hata', 'Aidat ödeme başarısız oldu.');
      }
    } catch (error) {
      Alert.alert('Hata', 'Aidat ödeme sırasında bir hata oluştu.');
    }
  };

  const markAsPaid = (id: string) => {
    const updatedPayments = payments.map(payment =>
      payment.id === id ? { ...payment, status: 'Ödendi' } : payment
    );
    setPayments(updatedPayments);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ActivityIndicator size="large" color="#FFA500" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={payments}
        renderItem={({ item }) => (
          <View style={styles.paymentCard}>
            <Text style={styles.amountText}>Tutar: {item.amount} TL</Text>
            <Text style={styles.dueDateText}>Son Ödeme Tarihi: {item.dueDate}</Text>
            <Text style={[styles.statusText, item.status === 'Ödenmedi' ? styles.overdue : styles.paid]}>
              Durum: {item.status}
            </Text>
            {item.status === 'Ödenmedi' && (
              <TouchableOpacity style={styles.payButton} onPress={() => handlePay(item.id, item.amount)}>
                <Text style={styles.payButtonText}>Öde</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
        keyExtractor={(item) => item.id}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  paymentCard: {
    backgroundColor: 'white',
    marginHorizontal: 10,
    marginVertical: 10,
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  amountText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  dueDateText: {
    fontSize: 14,
    color: '#777',
  },
  statusText: {
    fontSize: 16,
    marginVertical: 10,
  },
  overdue: {
    color: 'red',
  },
  paid: {
    color: 'green',
  },
  payButton: {
    backgroundColor: 'gold',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  payButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default AidatPaymentScreen;
