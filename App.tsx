import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AdminHomeScreen } from './screen/admin/AdminHomeScreen';
import { ResidentHomeScreen } from './screen/resident/ResidentHomeScreen';
import { SecurityHomeScreen } from './screen/SecurityHomeScreen';
import { LoginScreen } from './screen/LoginScreen';
import { ManageUsersScreen } from './screen/admin/ManageUsersScreen';
import { AnnouncementScreen } from './screen/admin/AnnouncementScreen';
import { SendNotificationScreen } from './screen/admin/SendNotificationScreen';
import { ExpenseDetailsScreen } from './screen/admin/ExpenseDetailsScreen';
import { AidatPaymentScreen } from './screen/resident/AidatPaymentScreen';
import { ReportIssueScreen } from './screen/resident/ReportIssueScreen';
import { EmergencyReportScreen } from './screen/resident/EmergencyReportScreen';
import { QRCodeScannerScreen } from './QRCodeScannerScreen';

const Stack = createNativeStackNavigator();

type UserType = 'admin' | 'resident' | 'security';

export default function App() {
  const [userType, setUserType] = useState<UserType | null>(null); // Kullanıcı türü state
  const [announcements, setAnnouncements] = useState<string[]>([
    'Yarın saat 10:00’da su kesintisi olacak.',
    'Aidat ödemelerinizi ay sonuna kadar yapmayı unutmayın.',
    'Site genelinde bakım çalışmaları yapılacaktır.',
  ]); // Dummy duyuru verileri

  const handleAddAnnouncement = (announcement: string) => {
    setAnnouncements([...announcements, announcement]); // Yeni duyuruyu listeye ekle
  };

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {userType === null ? (
          // Eğer kullanıcı henüz giriş yapmamışsa, Login ekranını göster
          <Stack.Screen
            name="Login"
            options={{ headerShown: false }}
          >
            {props => <LoginScreen {...props} setUserType={setUserType} />}
          </Stack.Screen>
        ) : (
          <>
            {/* Eğer kullanıcı türü "admin" ise admin paneli ekranlarını göster */}
            {userType === 'admin' && (
              <>
                <Stack.Screen name="AdminHome" component={AdminHomeScreen} options={{ headerShown: false }} />
                <Stack.Screen name="ManageUsers" component={ManageUsersScreen} options={{ title: 'Kullanıcıları Yönet' }} />
                <Stack.Screen name="ExpenseDetails" component={ExpenseDetailsScreen} options={{ title: 'Aidat ve Gider Detayları' }} />
                <Stack.Screen name="Announcement" options={{ title: 'Duyuru Yap' }}>
                  {props => <AnnouncementScreen {...props} onAddAnnouncement={handleAddAnnouncement} />}
                </Stack.Screen>
                <Stack.Screen name="SendNotification" component={SendNotificationScreen} options={{ title: 'Bildirim Gönder' }} />
                <Stack.Screen name="QRCodeScanner" component={QRCodeScannerScreen} options={{ title: 'QR Kod Tarayıcı' }} />
              </>
            )}

            {/* Eğer kullanıcı türü "resident" (site sakini) ise resident panelini göster */}
            {userType === 'resident' && (
              <>
                <Stack.Screen
                  name="ResidentHome"
                  options={{ headerShown: false }}
                >
                  {props => <ResidentHomeScreen {...props} announcements={announcements} />}
                </Stack.Screen>
                <Stack.Screen
                  name="AidatPayment"
                  component={AidatPaymentScreen}
                  options={{ title: 'Aidat Ödemeleri' }}
                />
                <Stack.Screen name="ReportIssue" component={ReportIssueScreen} options={{ title: 'Sorun Bildir' }} />
                <Stack.Screen name="EmergencyReport" component={EmergencyReportScreen} options={{ headerShown: false }} />

              </>
            )}

            {/* Eğer kullanıcı türü "security" (güvenlik) ise güvenlik panelini göster */}
            {userType === 'security' && (
              <><Stack.Screen name="SecurityHome" component={SecurityHomeScreen} options={{ headerShown: false }} /><Stack.Screen name="QRCodeScanner" component={QRCodeScannerScreen} options={{ title: 'QR Kod Tarayıcı' }} /></>
            )}
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
