import React, { useEffect, useState } from 'react';
import { Alert, FlatList, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Expense, Resident } from '../../types';
import { ExpenseCard } from '../../components/ExpenseCard';
import { ResidentCard } from '../../components/ResidentCard';
import { ResidentDetailsModal } from '../../components/ResidentDetailsModal';

export const ExpenseDetailsScreen = () => {
  // Sakinler listesini tutmak için state
  const [residents, setResidents] = useState<Resident[]>([]);
  // Giderler listesini tutmak için state
  const [expenses, setExpenses] = useState<Expense[]>([]);
  // Seçilen sakin bilgilerini tutmak için state (modalda gösterilecek)
  const [selectedResident, setSelectedResident] = useState<Resident | null>(null);
  // Sakin detayları modalının görünürlüğünü kontrol eden state
  const [isModalVisible, setIsModalVisible] = useState(false);
  // Toplam ödenmiş aidat miktarını tutmak için state
  const [totalPaid, setTotalPaid] = useState(0);
  // Toplam ödenmemiş aidat miktarını tutmak için state
  const [totalUnpaid, setTotalUnpaid] = useState(0);

  // Bileşen yüklendiğinde sakinleri ve giderleri getir
  useEffect(() => {
    console.log('Bileşen yüklendi, sakinler ve giderler getirilecek');
    fetchResidents();
    fetchExpenses();
  }, []);

  // API'den sakin verilerini getiren fonksiyon
  const fetchResidents = async () => {
    console.log('Sakinler verileri getiriliyor...');
    try {
      const response = await fetch('https://aparthus-api.vercel.app/api/residents');
      if (!response.ok) {
        // API isteği başarısız olursa hata mesajını konsola yazdır
        console.log("Sakinler yüklenirken API hata döndü", await response.text());
        throw new Error("API yanıtı başarısız");
      }
      const data = await response.json();
      console.log('Sakinler verileri başarıyla getirildi:', data);
      setResidents(data);
    } catch (error) {
      console.error('Sakinler yüklenirken hata:', error);
      Alert.alert('Hata', 'Sakinler yüklenirken bir hata oluştu.');
    }
  };

  // API'den gider verilerini getiren fonksiyon
  const fetchExpenses = async () => {
    console.log('Gider verileri getiriliyor...');
    try {
      const response = await fetch('https://aparthus-api.vercel.app/api/expenses');
      if (!response.ok) {
        // API isteği başarısız olursa hata mesajını konsola yazdır
        console.log("Giderler yüklenirken API hata döndü", await response.text());
        throw new Error("API yanıtı başarısız");
      }
      const data = await response.json();
      console.log('Gider verileri başarıyla getirildi:', data);
      setExpenses(data);
    } catch (error) {
      console.error('Giderler yüklenirken hata:', error);
      Alert.alert('Hata', 'Giderler yüklenirken bir hata oluştu.');
    }
  };

  // Sakinler listesini güncellediğimizde toplam ödenen ve ödenmeyen aidat miktarlarını hesapla
  useEffect(() => {
    console.log('Sakinler listesi güncellendi, toplamlar hesaplanıyor...');
    calculateTotals();
  }, [residents]);

  // Toplam ödenen ve ödenmeyen aidatları hesaplayan fonksiyon
  const calculateTotals = () => {
    console.log('Toplam ödenen ve ödenmeyen aidatları hesaplama başladı...');
    let paid = 0;
    let unpaid = 0;

    // Her bir sakini kontrol ederek ödenen ve ödenmeyen aidatları ayır
    residents.forEach((resident) => {
      if (resident.hasPaid) {
        paid += resident.amountDue;
      } else {
        unpaid += resident.amountDue;
      }
    });

    // State'leri güncelle
    console.log(`Toplam ödenen aidat: ${paid}, Toplam ödenmeyen aidat: ${unpaid}`);
    setTotalPaid(paid);
    setTotalUnpaid(unpaid);
  };

  // Belirli bir sakine ödeme hatırlatması yapmak için kullanılan fonksiyon
  const requestPaymentReminder = (resident: Resident) => {
    console.log(`Ödeme hatırlatması isteniyor: ${resident.firstName} ${resident.lastName}`);
    // Eğer sakin zaten ödemişse, hatırlatmaya gerek yok
    if (resident.hasPaid) {
      Alert.alert('Bilgi', `${resident.firstName} ${resident.lastName} zaten ödemesini yapmış.`);
      return;
    }

    // Kullanıcıya hatırlatma göndermek istediğinden emin olup olmadığını sor
    Alert.alert(
      'Aidat Hatırlatma',
      `${resident.firstName} ${resident.lastName} için ödeme hatırlatması gönderilsin mi?`,
      [
        { text: 'İptal', style: 'cancel' },
        { text: 'Evet', onPress: () => sendPaymentReminder(resident) },
      ]
    );
  };

  // Belirli bir sakine ödeme hatırlatması gönderen fonksiyon (API isteği yapar)
  const sendPaymentReminder = async (resident: Resident) => {
    console.log(`Ödeme hatırlatması gönderiliyor: ${resident._id}`);
    
    // Borcu olmayanlara hatırlatma göndermeyin
    if (resident.amountDue === 0) {
      console.log(`${resident.firstName} ${resident.lastName} borcu olmadığı için hatırlatma gönderilmiyor.`);
      Alert.alert('Bilgi', `${resident.firstName} ${resident.lastName} borcu olmadığı için hatırlatma gönderilmiyor.`);
      return;
    }
  
    try {
      const response = await fetch(`https://aparthus-api.vercel.app/api/residents/${resident._id}/reminder`, {
        method: 'POST',
      });
  
      if (response.ok) {
        console.log(`Ödeme hatırlatması başarıyla gönderildi: ${resident.firstName} ${resident.lastName}`);
        Alert.alert('Hatırlatma Gönderildi', `${resident.firstName} ${resident.lastName} için aidat hatırlatması gönderildi.`);
      } else {
        console.error(`Hatırlatma gönderilirken hata oluştu: ${await response.text()}`);
        Alert.alert('Hata', 'Hatırlatma gönderilirken bir hata oluştu.');
      }
    } catch (error) {
      console.error('Hatırlatma gönderilirken bağlantı hatası oluştu:', error);
      Alert.alert('Bağlantı Hatası', 'Sunucuya ulaşılamadı.');
    }
  };
  

  // Ödeme yapmayan tüm sakinlere toplu hatırlatma gönderen fonksiyon
  const sendBulkReminders = () => {
    console.log('Toplu hatırlatma gönderme işlemi başlatılıyor...');
  
    // Borcu olmayan sakinleri filtrele
    const unpaidResidents = residents.filter(resident => !resident.hasPaid && resident.amountDue > 0);
  
    // Eğer ödemeyen sakin yoksa kullanıcıya bilgi ver
    if (unpaidResidents.length === 0) {
      console.log('Tüm sakinler ödemelerini yapmış veya borcu yok.');
      Alert.alert('Bilgi', 'Tüm sakinler ödemelerini yapmış veya borcu yok.');
      return;
    }
  
    // Kullanıcıya tüm ödemeyen sakinlere hatırlatma göndermek isteyip istemediğini sor
    Alert.alert(
      'Toplu Hatırlatma',
      'Tüm ödemeyen sakinlere hatırlatma gönderilsin mi?',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Evet',
          onPress: () => {
            unpaidResidents.forEach(resident => {
              console.log(`Toplu hatırlatma gönderiliyor: ${resident.firstName} ${resident.lastName}`);
              sendPaymentReminder(resident);
            });
          }
        },
      ]
    );
  };
  

  // Belirli bir sakinin detaylarını gösteren modalı açan fonksiyon
  const showResidentDetails = (resident: Resident) => {
    console.log(`Sakin detayları gösteriliyor: ${resident.firstName} ${resident.lastName}`);
    setSelectedResident(resident);
    setIsModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.safeArea}>

      <View style={styles.container}>
        <Text style={styles.title}>Aidat ve Gider Detayları</Text>

        {/* Toplam ödenen ve ödenmeyen aidat miktarlarını gösteren özet bölüm */}
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryText}>Toplam Ödenen Aidat: <Text style={styles.paidAmount}>{totalPaid} ₺</Text></Text>
          <Text style={styles.summaryText}>Toplam Ödenmeyen Aidat: <Text style={styles.unpaidAmount}>{totalUnpaid} ₺</Text></Text>
        </View>

        {/* Ödenmemiş faturaları görmek için buton */}
        <TouchableOpacity style={styles.unpaidButton} onPress={() => Alert.alert('Ödenmemiş Faturalar')}>
          <Text style={styles.unpaidButtonText}>Ödenmemiş Faturalar</Text>
        </TouchableOpacity>

        {/* Aidat talep durumu bölümünü gösteren liste */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Aidat Talep Durumu</Text>
          <FlatList
            data={residents}
            renderItem={({ item }) => (
              <ResidentCard
                key={item._id}
                resident={{ ...item, id: item._id }} // `id` alanını manuel olarak atıyoruz
                onRequestPayment={requestPaymentReminder}
                onShowDetails={showResidentDetails}
                onCall={() => Alert.alert('Aranıyor', `${item.contactNumber}`)}
              />

            )}
            keyExtractor={(item) => item._id}
          />
        </View>

        {/* Tüm ödemeyenlere toplu hatırlatma gönderme butonu */}
        <TouchableOpacity style={styles.bulkReminderButton} onPress={sendBulkReminders}>
          <Text style={styles.bulkReminderText}>🔔 Toplu Hatırlatma Gönder 🔔</Text>
        </TouchableOpacity>

        {/* Gider detaylarını gösteren liste */}
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

        {/* Sakin detaylarını gösteren modal */}
        <ResidentDetailsModal
          resident={selectedResident}
          isVisible={isModalVisible}
          onClose={() => {
            console.log('Sakin detayları modalı kapatıldı');
            setIsModalVisible(false);
          }}
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
    padding: 10,
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
