export interface CommonProps {
  username: string;
  email: string;
  password: string;
  phoneNumber: string;
  yoneticiId?: string; 
  setUsername: (value: string) => void;
  setEmail: (value: string) => void;
  setPhoneNumber: (value: string) => void;
  setPassword: (value: string) => void;
  setYoneticiId?: (value: string) => void; 
}

export default CommonProps;
