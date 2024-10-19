import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Expense, Resident } from '../../types';
import { ResidentCard } from '../../components/ResidentCard';
import { ExpenseCard } from '../../components/ExpenseCard';
import { ResidentDetailsModal } from '../../components/ResidentDetailsModal';

export const ExpenseDetailsScreen = () => {
  const [residents, setResidents] = useState<Resident[]>([
    {
      id: '1',
      firstName: 'Ahmet',
      lastName: 'Yılmaz',
      block: 'A',
      siteName: 'Aytur Sitesi',
      apartmentNumber: 12,
      contactNumber: '05001112233',
      amountDue: 300,
      hasPaid: false,
      dueDate: '2024-02-01',
    },
    {
      id: '2',
      firstName: 'Ayşe',
      lastName: 'Demir',
      block: 'B',
      siteName: 'Aytur Sitesi',
      apartmentNumber: 8,
      contactNumber: '05002223344',
      amountDue: 300,
      hasPaid: true,
      dueDate: '2024-01-15',
    },
    {
      id: '3',
      firstName: 'Mehmet',
      lastName: 'Kaya',
      block: 'C',
      siteName: 'Aytur Sitesi',
      apartmentNumber: 20,
      contactNumber: '05003334455',
      amountDue: 300,
      hasPaid: false,
      dueDate: '2024-02-10',
    },
  ]);

  const [expenses, setExpenses] = useState<Expense[]>([
    { id: '1', description: 'Asansör Bakım', amount: 500, date: '2024-01-01' },
    { id: '2', description: 'Temizlik Gideri', amount: 200, date: '2024-01-10' },
    { id: '3', description: 'Güvenlik Sistemi Bakım', amount: 700, date: '2024-02-15' },
  ]);

  const [selectedResident, setSelectedResident] = useState<Resident | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [totalPaid, setTotalPaid] = useState(0); // Ödenen aidatların toplamı
  const [totalUnpaid, setTotalUnpaid] = useState(0); // Ödenmeyen aidatların toplamı

  useEffect(() => {
    calculateTotals();
  }, [residents]);

  const calculateTotals = () => {
    let paid = 0;
    let unpaid = 0;

    residents.forEach((resident) => {
      if (resident.hasPaid) {
        paid += resident.amountDue;
      } else {
        unpaid += resident.amountDue;
      }
    });

    setTotalPaid(paid);
    setTotalUnpaid(unpaid);
  };

  const requestPaymentReminder = (resident: Resident) => {
    if (resident.hasPaid) {
      Alert.alert('Bilgi', `${resident.firstName} ${resident.lastName} zaten ödemesini yapmış.`);
      return;
    }

    Alert.alert(
      'Aidat Hatırlatma',
      `${resident.firstName} ${resident.lastName} için ödeme hatırlatması gönderilsin mi?`,
      [
        { text: 'İptal', style: 'cancel' },
        { text: 'Evet', onPress: () => sendPaymentReminder(resident) },
      ]
    );
  };

  const sendPaymentReminder = (resident: Resident) => {
    Alert.alert('Hatırlatma Gönderildi', `${resident.firstName} ${resident.lastName} için aidat hatırlatması gönderildi.`);
  };

  const sendBulkReminders = () => {
    const unpaidResidents = residents.filter(resident => !resident.hasPaid);
    if (unpaidResidents.length === 0) {
      Alert.alert('Bilgi', 'Tüm sakinler ödemelerini yapmış.');
      return;
    }
    Alert.alert(
      'Toplu Hatırlatma',
      'Tüm ödemeyen sakinlere hatırlatma gönderilsin mi?',
      [
        { text: 'İptal', style: 'cancel' },
        { text: 'Evet', onPress: () => {
          unpaidResidents.forEach(resident => sendPaymentReminder(resident));
        }},
      ]
    );
  };

  const showResidentDetails = (resident: Resident) => {
    setSelectedResident(resident);
    setIsModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Aidat ve Gider Detayları</Text>

        {/* Ödenen ve Ödenmeyen Aidatlar */}
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryText}>Toplam Ödenen Aidat: <Text style={styles.paidAmount}>{totalPaid} ₺</Text></Text>
          <Text style={styles.summaryText}>Toplam Ödenmeyen Aidat: <Text style={styles.unpaidAmount}>{totalUnpaid} ₺</Text></Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Aidat Talep Durumu</Text>
          <FlatList
            data={residents}
            renderItem={({ item }) => (
              <ResidentCard
                resident={item}
                onRequestPayment={requestPaymentReminder}
                onShowDetails={showResidentDetails}
                onCall={() => Alert.alert('Aranıyor', `${item.contactNumber}`)}
              />
            )}
            keyExtractor={(item) => item.id}
          />
        </View>

        <TouchableOpacity style={styles.bulkReminderButton} onPress={sendBulkReminders}>
          <Text style={styles.bulkReminderText}>🔔 Toplu Hatırlatma Gönder 🔔</Text>
        </TouchableOpacity>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Gider Detayları</Text>
          <FlatList
            data={expenses}
            renderItem={({ item }) => <ExpenseCard expense={item} />}
            keyExtractor={(item) => item.id}
          />
        </View>

        <ResidentDetailsModal
          resident={selectedResident}
          isVisible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          onCall={(phoneNumber) => Alert.alert('Aranıyor', `${phoneNumber}`)}
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
    backgroundColor: 'white',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'black',
    marginBottom: 20,
  },
  summaryContainer: {
    marginBottom: 20,
    backgroundColor: '#F5F5F5',
    padding: 20,
    borderRadius: 12,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    justifyContent: 'space-evenly',
    elevation: 2,
  },
  summaryText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'black',
    marginBottom: 5,
  },
  paidAmount: {
    color: 'green',
  },
  unpaidAmount: {
    color: 'red',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'black',
  },
  bulkReminderButton: {
    backgroundColor: '#FF7043',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#FF7043',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  bulkReminderText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

