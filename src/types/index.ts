export type Currency = 'BYN' | 'USD' | 'EUR' | 'USDT' | 'BTC';
export type DebtType = 'money' | 'thing';
export type DebtDirection = 'give' | 'take';
export type DebtStatus = 'pending' | 'confirmed' | 'closed';

export interface Contact {
  id: string;
  name: string;
  phone?: string;
  messenger?: string;
  messengerHandle?: string;
  initials: string;
  color: string;
  inApp: boolean;
}

export interface Debt {
  id: string;
  contactId: string;
  contactName: string;
  contactInitials: string;
  contactColor: string;
  direction: DebtDirection;
  type: DebtType;
  amount?: number;
  currency?: Currency;
  description?: string;
  returnDate?: string;
  comment?: string;
  status: DebtStatus;
  createdAt: string;
  closedAt?: string;
}

export interface Group {
  id: string;
  name: string;
  emoji: string;
  currency: Currency;
  memberIds: string[];
  totalBalance: number;
  createdAt: string;
}

export interface UserProfile {
  name: string;
  username: string;
  phone: string;
  defaultCurrency: Currency;
  isPremium: boolean;
  pushEnabled: boolean;
  reminderDays: number;
}
