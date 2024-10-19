import React, { useState } from 'react';
import { SafeAreaView, View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';

const paymentData = [
  { id: '1', month: 'Ocak', amount: 500, status: 'Ödendi' },
  { id: '2', month: 'Şubat', amount: 500, status: 'Ödenmedi' },
  { id: '3', month: 'Mart', amount: 500, status: 'Ödenmedi' },
  { id: '4', month: 'Nisan', amount: 500, status: 'Ödenmedi' },
];

export const AidatPaymentScreen = () => {
  const [payments, setPayments] = useState(paymentData);

  const handlePay = (id: string) => {
    Alert.alert(
      'Ödeme Onayı',
      'Bu aidatı ödemek istediğinizden emin misiniz?',
      [
        { text: 'Hayır', style: 'cancel' },
        { text: 'Evet', onPress: () => markAsPaid(id) }
      ]
    );
  };

  const markAsPaid = (id: string) => {
    const updatedPayments = payments.map(payment =>
      payment.id === id ? { ...payment, status: 'Ödendi' } : payment
    );
    setPayments(updatedPayments);
  };

  const renderPaymentItem = ({ item }: { item: { id: string; month: string; amount: number; status: string } }) => (
    <View style={styles.paymentCard}>
      <Text style={styles.paymentText}>Ay: {item.month}</Text>
      <Text style={styles.paymentText}>Tutar: {item.amount} TL</Text>
      <Text style={[styles.paymentText, item.status === 'Ödenmedi' ? styles.unpaid : styles.paid]}>
        Durum: {item.status}
      </Text>
      {item.status === 'Ödenmedi' && (
        <TouchableOpacity style={styles.payButton} onPress={() => handlePay(item.id)}>
          <Text style={styles.buttonText}>Öde</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const getTotalPaid = () => payments.filter(payment => payment.status === 'Ödendi').reduce((sum, payment) => sum + payment.amount, 0);
  const getTotalUnpaid = () => payments.filter(payment => payment.status === 'Ödenmedi').reduce((sum, payment) => sum + payment.amount, 0);

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Summary Cards */}
      <View style={styles.summaryContainer}>
        <View style={[styles.summaryCard, styles.activeCard]}>
          <Text style={styles.cardTitle}>Ödenen</Text>
          <Text style={styles.cardAmount}>{getTotalPaid()} TL</Text>
        </View>
        <View style={[styles.summaryCard, styles.passiveCard]}>
          <Text style={styles.cardTitle}>Ödenmeyen</Text>
          <Text style={styles.cardAmount}>{getTotalUnpaid()} TL</Text>
        </View>
      </View>

      {/* Aidat Listesi */}
      <FlatList
        data={payments}
        renderItem={renderPaymentItem}
        keyExtractor={(item) => item.id}
      />
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
  paymentCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 10,
    padding: 20,
    borderRadius: 12, 
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  paymentText: {
    fontSize: 16,
    marginBottom: 5,
    color: 'black', 
    fontWeight: 'semibold',
  },
  payButton: {
    backgroundColor: 'gold', 
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: 'gold',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  buttonText: {
    color: 'black',
    fontWeight: 'bold',
  },
  paid: {
    color: 'green',
    fontWeight: 'bold',
  },
  unpaid: {
    color: 'red',
    fontWeight: 'bold',
  },
  // Summary Cards
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    marginBottom: 20,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: 'white',
    padding: 25,
    borderRadius: 12, 
    marginHorizontal: 5,
    alignItems: 'center',
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  activeCard: {
    borderColor: 'green',
    borderWidth: 1,
  },
  passiveCard: {
    borderColor: 'red', 
    borderWidth: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 10,
  },
  cardAmount: {
    fontSize: 26,
    fontWeight: 'bold',
  },
});
