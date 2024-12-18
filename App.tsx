import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { YoneticiHomeScreen } from './screen/yonetici/YoneticiHomeScreen';
import { ResidentHomeScreen } from './screen/resident/ResidentHomeScreen';
import { SecurityHomeScreen } from './screen/SecurityHomeScreen';
import { LoginScreen } from './screen/LoginScreen';
import { AnnouncementScreen } from './screen/yonetici/AnnouncementScreen';
import { SendNotificationScreen } from './screen/yonetici/SendNotificationScreen';
import { ExpenseDetailsScreen } from './screen/yonetici/ExpenseDetailsScreen';
import { AidatPaymentScreen } from './screen/resident/AidatPaymentScreen';
import { ReportIssueScreen } from './screen/resident/ReportIssueScreen';
import { EmergencyReportScreen } from './screen/resident/EmergencyReportScreen';
import QRCodeScannerScreen from './QRCodeScannerScreen';
import { UserManagementScreen } from './screen/yonetici/UserManagementScreen';
import BankTransactionsScreen from './screen/yonetici/BankTransactionsScreen';
import TaskTrackingScreen from './screen/yonetici/TaskTrackingScreen';
import RegisterScreen from './screen/RegisterScreen';

const Stack = createNativeStackNavigator();

type role = 'yonetici' | 'resident' | 'security';

export default function App() {
  const [role, setrole] = useState<role | null>(null); // Kullanıcı türü state
  const [announcements, setAnnouncements] = useState<string[]>([
    'Yarın saat 10:00’da su kesintisi olacak.',
    'Aidat ödemelerinizi ay sonuna kadar yapmayı unutmayın.',
    'Site genelinde bakım çalışmaları yapılacaktır.',
  ]);

  const handleAddAnnouncement = (announcement: string) => {
    setAnnouncements([...announcements, announcement]);
  };

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        {/* Login ve Register Ekranları */}
        <Stack.Screen
          name="Login"
          options={{ headerShown: false }}
        >
          {props => <LoginScreen {...props} setrole={setrole} />}
        </Stack.Screen>
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ title: 'Kaydol', headerShown: false }}
        />

        {/* Yonetici Ekranları */}
        <Stack.Screen
          name="YoneticiHome"
          options={{ headerShown: false }}
        >
          {props => <YoneticiHomeScreen {...props} name="Yonetici Paneli" />}
        </Stack.Screen>
        <Stack.Screen
          name="UserManagement"
          component={UserManagementScreen}
          options={{ title: 'Kullanıcı Yönetimi' }}
        />
        <Stack.Screen
          name="ExpenseDetails"
          component={ExpenseDetailsScreen}
          options={{ title: 'Aidat ve Gider Detayları' }}
        />
        <Stack.Screen
          name="Announcement"
          options={{ title: 'Duyuru Yap' }}
        >
          {props => <AnnouncementScreen {...props} onAddAnnouncement={handleAddAnnouncement} />}
        </Stack.Screen>
        <Stack.Screen
          name="SendNotification"
          component={SendNotificationScreen}
          options={{ title: 'Bildirim Gönder' }}
        />
        <Stack.Screen
          name="QRCodeScanner"
          component={QRCodeScannerScreen}
          options={{ title: 'QR Kod Tarayıcı' }}
        />
        <Stack.Screen
          name="BankTransactions"
          component={BankTransactionsScreen}
          options={{ title: 'Banka Transferi' }}
        />
        <Stack.Screen
          name="TaskTracking"
          component={TaskTrackingScreen}
          options={{ title: 'Görev Takip' }}
        />

        {/* Resident Ekranları */}
        <Stack.Screen
          name="ResidentHome"
          options={{ headerShown: false }}
        >
          {props => <ResidentHomeScreen {...props} announcements={announcements} />}
        </Stack.Screen>
        <Stack.Screen
          name="AidatPayment"
          component={AidatPaymentScreen}
          options={{ title: 'Aidat Ödemeleri' }}
        />
        <Stack.Screen
          name="ReportIssue"
          component={ReportIssueScreen}
          options={{ title: 'Sorun Bildir' }}
        />
        <Stack.Screen
          name="EmergencyReport"
          component={EmergencyReportScreen}
          options={{ title: 'Acil Durum Bildir' }}
        />

        {/* Security Ekranları */}
        <Stack.Screen
          name="SecurityHome"
          component={SecurityHomeScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
