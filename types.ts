export type RootStackParamList = {
  Login: undefined;
  AdminHome: undefined;
  ManageUsers: undefined; 
  ExpenseDetails: undefined; 
  Announcement: undefined;
  SendNotification: undefined;
  QRCodeScanner: undefined;
  ResidentHome: undefined;
  AidatPayment: undefined;
  ReportIssue: undefined;
  EmergencyReport: undefined;
  SecurityHome: undefined;
};


export interface LoginScreenProps {
  username: string;
  password: string;
  setUserType: (userType: 'admin' | 'resident' | 'security') => void;
}

export interface Resident {
  id: string;
  firstName: string;
  lastName: string;
  block: string;
  siteName: string;
  apartmentNumber: number;
  contactNumber: string;
  amountDue: number;
  hasPaid: boolean;
  dueDate: string;
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  date: string;
}