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
import { UserManagementScreen } from './screen/admin/UserManagementScreen';
import BankTransactionsScreen from './screen/admin/BankTransactionsScreen';
import TaskTrackingScreen from './screen/admin/TaskTrackingScreen';

const Stack = createNativeStackNavigator();

type role = 'admin' | 'resident' | 'security';

export default function App() {
  const [role, setrole] = useState<role | null>(null); // Kullanıcı türü state
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
        {role === null ? (
          // Eğer kullanıcı henüz giriş yapmamışsa, Login ekranını göster
          <Stack.Screen
            name="Login"
            options={{ headerShown: false }}
          >
            {props => <LoginScreen {...props} setrole={setrole} />}
          </Stack.Screen>
        ) : (
          <>
            {/* Eğer kullanıcı türü "admin" ise admin paneli ekranlarını göster */}
            {role === 'admin' && (
              <>
                <Stack.Screen name="AdminHome" options={{ headerShown: false }}>
                  {props => <AdminHomeScreen {...props} name="Admin Paneli" />}
                </Stack.Screen>
                <Stack.Screen name="ManageUsers" component={ManageUsersScreen} options={{ title: 'Kullanıcıları Yönet' }} />
                <Stack.Screen name="UserManagement" component={UserManagementScreen} options={{ title: 'Kullanıcı Yönetimi' }} />
                <Stack.Screen name="ExpenseDetails" component={ExpenseDetailsScreen} options={{ title: 'Aidat ve Gider Detayları' }} />
                <Stack.Screen name="Announcement" options={{ title: 'Duyuru Yap' }}>
                  {props => <AnnouncementScreen {...props} onAddAnnouncement={handleAddAnnouncement} />}
                </Stack.Screen>
                <Stack.Screen name="SendNotification" component={SendNotificationScreen} options={{ title: 'Bildirim Gönder' }} />
                <Stack.Screen name="QRCodeScanner" component={QRCodeScannerScreen} options={{ title: 'QR Kod Tarayıcı' }} />
                <Stack.Screen name="BankTransactions" component={BankTransactionsScreen} options={{ title: 'Banka Transferi' }} />
                <Stack.Screen name="TaskTracking" component={TaskTrackingScreen} options={{ title: 'Görev Takip' }} />
              </>
            )}

            {/* Eğer kullanıcı türü "resident" (site sakini) ise resident panelini göster */}
            {role === 'resident' && (
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
            {role === 'security' && (
              <><Stack.Screen name="SecurityHome" component={SecurityHomeScreen} options={{ headerShown: false }} /><Stack.Screen name="QRCodeScanner" component={QRCodeScannerScreen} options={{ title: 'QR Kod Tarayıcı' }} /></>
            )}
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
