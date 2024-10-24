import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, FlatList, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../types';

interface Announcement {
  message: string;
  block: string;
  scheduledAt: Date;
  mediaUrl?: string;
}

type ResidentHomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ResidentHome'>;

export const ResidentHomeScreen: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const navigation = useNavigation<ResidentHomeScreenNavigationProp>();

  // Duyuruları veritabanından çekmek için useEffect kullanımı
  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await fetch('https://yunis-api.vercel.app/api/residents/announcements');
        
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const data = await response.json();
          
          if (response.ok) {
            setAnnouncements(data);
          } else {
            console.error('Duyurular getirilirken bir hata oluştu:', data);
            Alert.alert('Hata', data.message || 'Duyurular getirilirken bir sorun oluştu.');
          }
        } else {
          // JSON olmayan bir yanıt varsa hatayı göster
          const text = await response.text(); // JSON değilse düz metin olarak yanıtı alalım
          console.error('Beklenmeyen yanıt:', text);
          Alert.alert('Hata', 'Sunucudan beklenmeyen veri formatı alındı.');
        }
      } catch (error) {
        console.error('Duyurular alınırken hata:', error);
        Alert.alert('Hata', 'Duyurular alınırken bir hata oluştu.');
      }
    };
    
    fetchAnnouncements(); // useEffect'in içinde fonksiyonu çağırıyoruz.
  }, []); // useEffect'in bağımlılığı boş olduğunda sadece component yüklendiğinde çalışır

  // Aidat ödeme işlemine yönlendirme
  const handleAidatPayment = () => {
    navigation.navigate('AidatPayment'); 
  };

  const handleReportIssue = async () => {
    try {
      const response = await fetch('https://yunis-api.vercel.app/api/residents/reportIssue', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          residentId: 'resident_id',
          issue: 'description of the issue',
          photoUrl: 'optional_photo_url',
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Başarılı', 'Sorun bildiriminiz başarıyla gönderildi.');
      } else {
        Alert.alert('Hata', data.message || 'Sorun bildirimi gönderilemedi.');
      }
    } catch (error) {
      console.error('Sorun bildirimi hatası:', error);
      Alert.alert('Hata', 'Sorun bildirimi sırasında bir hata oluştu.');
    }
  };

  const handleEmergencyReport = async () => {
    try {
      const response = await fetch('https://yunis-api.vercel.app/api/residents/emergencyReport', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          residentId: 'resident_id',
          emergencyType: 'fire',
          description: 'Emergency description',
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Başarılı', 'Acil durum bildiriminiz gönderildi.');
      } else {
        Alert.alert('Hata', data.message || 'Acil durum bildirimi başarısız oldu.');
      }
    } catch (error) {
      console.error('Acil durum bildirimi hatası:', error);
      Alert.alert('Hata', 'Acil durum bildirimi sırasında bir hata oluştu.');
    }
  };

  const renderAnnouncement = ({ item }: { item: Announcement }) => (
    <View style={styles.announcementCard}>
      <Text style={styles.announcementItem}>🔔 {item.message}</Text>
      <Text style={styles.announcementItem}>🗓️ {new Date(item.scheduledAt).toLocaleString()}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.section}>
          <Image source={require('../../assets/icon.png')} style={styles.logo} />
          <Text style={styles.subtitle}>Duyurular</Text>
          {announcements.length === 0 ? (
            <Text style={styles.noAnnouncements}>Henüz duyuru yok.</Text>
          ) : (
            <FlatList
              data={announcements}
              renderItem={renderAnnouncement}
              keyExtractor={(item, index) => index.toString()}
            />
          )}
        </View>

        {/* Resident Action Buttons */}
        <View style={styles.section}>
          <Text style={styles.subtitle}>İşlemler</Text>
          <TouchableOpacity style={styles.actionButton} onPress={handleAidatPayment}>
            <Text style={styles.actionButtonText}>Aidat Ödemeleri</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={handleReportIssue}>
            <Text style={styles.actionButtonText}>Sorun Bildir</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={handleEmergencyReport}>
            <Text style={styles.actionButtonText}>Acil Durum Bildir</Text>
          </TouchableOpacity>
        </View>
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
    justifyContent: 'center',
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 20,
    alignSelf: 'center',
    justifyContent: 'center',
    resizeMode: 'contain',
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
  },
  section: {
    marginBottom: 30,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'left',
    color: 'black',
  },
  noAnnouncements: {
    fontSize: 16,
    fontStyle: 'italic',
    textAlign: 'center',
    color: 'gray',
  },
  announcementCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    marginVertical: 10,
    shadowColor: 'gray',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  announcementItem: {
    fontSize: 14,
    fontStyle: 'italic',
    textAlign: 'left',
    fontWeight: '600',
    color: '#333',
  },
  actionButton: {
    backgroundColor: 'gold',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: 'gold',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  actionButtonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ResidentHomeScreen;
