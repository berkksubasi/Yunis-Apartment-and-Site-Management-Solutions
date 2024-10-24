import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Expense, Resident } from '../../types';
import { ResidentCard } from '../../components/ResidentCard';
import { ExpenseCard } from '../../components/ExpenseCard';
import { ResidentDetailsModal } from '../../components/ResidentDetailsModal';

export const ExpenseDetailsScreen = () => {
  const [residents, setResidents] = useState<Resident[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [selectedResident, setSelectedResident] = useState<Resident | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [totalPaid, setTotalPaid] = useState(0);
  const [totalUnpaid, setTotalUnpaid] = useState(0);

  useEffect(() => {
    fetchResidents();
    fetchExpenses();
  }, []);

  const fetchResidents = async () => {
    try {
      const response = await fetch('https://yunis-api.vercel.app/api/residents');
      if (!response.ok) {
        console.log("Sakinler yüklenirken API hata döndü", await response.text());
        throw new Error("API yanıtı başarısız");
      }
      const data = await response.json();
      setResidents(data);
    } catch (error) {
      console.error('Sakinler yüklenirken hata:', error);
      Alert.alert('Hata', 'Sakinler yüklenirken bir hata oluştu.');
    }
  };

  const fetchExpenses = async () => {
    try {
      const response = await fetch('https://yunis-api.vercel.app/api/expenses');
      if (!response.ok) {
        console.log("Giderler yüklenirken API hata döndü", await response.text());
        throw new Error("API yanıtı başarısız");
      }
      const data = await response.json();
      setExpenses(data);
    } catch (error) {
      console.error('Giderler yüklenirken hata:', error);
      Alert.alert('Hata', 'Giderler yüklenirken bir hata oluştu.');
    }
  };

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

  const sendPaymentReminder = async (resident: Resident) => {
    try {
      const response = await fetch(`https://yunis-api.vercel.app/api/residents/${resident.id}/reminder`, {
        method: 'POST',
      });

      if (response.ok) {
        Alert.alert('Hatırlatma Gönderildi', `${resident.firstName} ${resident.lastName} için aidat hatırlatması gönderildi.`);
      } else {
        Alert.alert('Hata', 'Hatırlatma gönderilirken bir hata oluştu.');
      }
    } catch (error) {
      Alert.alert('Bağlantı Hatası', 'Sunucuya ulaşılamadı.');
    }
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

        <View style={styles.summaryContainer}>
          <Text style={styles.summaryText}>Toplam Ödenen Aidat: <Text style={styles.paidAmount}>{totalPaid} ₺</Text></Text>
          <Text style={styles.summaryText}>Toplam Ödenmeyen Aidat: <Text style={styles.unpaidAmount}>{totalUnpaid} ₺</Text></Text>
        </View>

        <TouchableOpacity style={styles.unpaidButton} onPress={() => Alert.alert('Ödenmemiş Faturalar')}>
          <Text style={styles.unpaidButtonText}>Ödenmemiş Faturalar</Text>
        </TouchableOpacity>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Aidat Talep Durumu</Text>
          <FlatList
            data={residents}
            renderItem={({ item }) => (
              <ResidentCard
                key={item._id}
                resident={item}
                onRequestPayment={requestPaymentReminder}
                onShowDetails={showResidentDetails}
                onCall={() => Alert.alert('Aranıyor', `${item.contactNumber}`)}
              />
            )}
            keyExtractor={(item) => item._id}
          />
        </View>

        <TouchableOpacity style={styles.bulkReminderButton} onPress={sendBulkReminders}>
          <Text style={styles.bulkReminderText}>🔔 Toplu Hatırlatma Gönder 🔔</Text>
        </TouchableOpacity>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Gider Detayları</Text>
          {expenses.length === 0 ? (
            <Text style={{ textAlign: 'center', marginVertical: 20 }}>Herhangi bir gider bulunmamaktadır.</Text>
          ) : (
            <FlatList
              data={expenses}
              renderItem={({ item }) => <ExpenseCard expense={item} />}
              keyExtractor={(item) => item.id}
            />
          )}
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
  unpaidButton: {
    backgroundColor: '#FFD700',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  unpaidButtonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
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
