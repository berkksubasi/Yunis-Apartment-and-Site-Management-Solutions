export type RootStackParamList = {
  Login: undefined;
  AdminHome: undefined;
  ManageUsers: undefined; 
  UserManagement: undefined; 
  ExpenseDetails: undefined; 
  Announcement: undefined;
  SendNotification: undefined;
  QRCodeScanner: undefined;
  ResidentHome: undefined;
  AidatPayment: undefined;
  ReportIssue: undefined;
  EmergencyReport: undefined;
  SecurityHome: undefined;
  BankTransactions: undefined;
  TaskTracking: undefined;
};

export interface LoginScreenProps {
  username: string;
  password: string;
  setrole: (role: 'admin' | 'resident' | 'security') => void;
}

export interface Resident {
  _id: string;
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
  username: string;
  email: string;
  password: string;
  isAdmin: boolean;
  isBlocked: boolean;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  date: string;
}

// Yeni kullanıcı yönetimi 
export interface UserManagementProps {
  residents: Resident[];
  onDelete: (id: string) => void;
  onEdit: (resident: Resident) => void;
  onAdd: (resident: Resident) => void;
}

// Ödeme bilgileri 
export interface Payment {
  id: string;
  amount: number;
  dueDate: string;
  status: string;
}

// Bank Transactions interface
export interface Transactions {
  id: string;
  amount: number;
  date: string;
  description: string;
}
export interface Task {
  id: string;
  title: string;
  location: string;
  assignedTo: string | null;
  status: 'İnceleniyor' | 'Bekleyen' | 'Tamamlanmış';
  date: string;
  icon: string;
}
