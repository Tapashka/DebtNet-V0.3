import { create } from 'zustand';
import { Contact, Debt, Group, UserProfile, Currency } from '../types';
import { CONTACT_COLORS } from '../constants/theme';

function genId() {
  return Math.random().toString(36).slice(2, 10);
}

function initials(name: string) {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

// ── Начальные данные ──────────────────────────
const INITIAL_CONTACTS: Contact[] = [
  { id: 'c1', name: 'Александр Петров', phone: '+375 29 100-01-01', messenger: 'telegram', messengerHandle: '@alex_p', initials: 'АП', color: '#5B4FE8', inApp: true },
  { id: 'c2', name: 'Мария Иванова',    phone: '+375 29 100-02-02', messenger: 'whatsapp', initials: 'МИ', color: '#10B981', inApp: true },
  { id: 'c3', name: 'Дмитрий Козлов',  phone: '+375 44 200-03-03', messenger: 'viber',    initials: 'ДК', color: '#F59E0B', inApp: true },
  { id: 'c4', name: 'Елена Волкова',   phone: '+375 29 300-04-04', initials: 'ЕВ', color: '#EF4444', inApp: true },
  { id: 'c5', name: 'Иван Новиков',    phone: '+375 29 300-05-05', initials: 'ИН', color: '#7B519D', inApp: false },
  { id: 'c6', name: 'Максим Гельф',    phone: '+375 44 704-29-94', initials: 'МГ', color: '#3B82F6', inApp: true },
];

const INITIAL_DEBTS: Debt[] = [
  { id: 'd1', contactId: 'c1', contactName: 'Александр Петров', contactInitials: 'АП', contactColor: '#5B4FE8', direction: 'give', type: 'money', amount: 300, currency: 'BYN', comment: 'Займ', status: 'confirmed', createdAt: '2026-03-05' },
  { id: 'd2', contactId: 'c2', contactName: 'Мария Иванова',    contactInitials: 'МИ', contactColor: '#10B981', direction: 'give', type: 'money', amount: 105, currency: 'BYN', comment: 'Обед',  status: 'confirmed', createdAt: '2026-03-12' },
  { id: 'd3', contactId: 'c3', contactName: 'Дмитрий Козлов',  contactInitials: 'ДК', contactColor: '#F59E0B', direction: 'take', type: 'money', amount: 150, currency: 'BYN', comment: 'Билеты', status: 'confirmed', createdAt: '2026-03-10' },
  { id: 'd4', contactId: 'c4', contactName: 'Елена Волкова',   contactInitials: 'ЕВ', contactColor: '#EF4444', direction: 'give', type: 'money', amount: 45,  currency: 'BYN', comment: 'Продукты', status: 'pending', createdAt: '2026-03-15' },
];

const INITIAL_GROUPS: Group[] = [
  { id: 'g1', name: 'Друзья с дачи', emoji: '🏖️', currency: 'BYN', memberIds: ['c1','c2','c3'], totalBalance: 126, createdAt: '2026-02-01' },
  { id: 'g2', name: 'Рабочие обеды', emoji: '💼', currency: 'USD', memberIds: ['c1','c3'],       totalBalance: -54, createdAt: '2026-01-15' },
];

// ── Стор ──────────────────────────────────────
interface StoreState {
  profile: UserProfile;
  contacts: Contact[];
  debts: Debt[];
  groups: Group[];

  // Profile
  updateProfile: (data: Partial<UserProfile>) => void;

  // Contacts
  addContact: (name: string, phone: string, messenger?: string, handle?: string) => void;

  // Debts
  addDebt: (debt: Omit<Debt, 'id' | 'createdAt'>) => void;
  closeDebt: (id: string) => void;
  confirmDebt: (id: string) => void;
  rejectDebt: (id: string) => void;

  // Groups
  addGroup: (name: string, emoji: string, currency: Currency, memberIds: string[]) => void;

  // Computed helpers
  getIncome: (currency?: Currency) => number;
  getExpenses: (currency?: Currency) => number;
  getPendingDebts: () => Debt[];
  getClosedDebts: () => Debt[];
}

export const useStore = create<StoreState>((set, get) => ({
  profile: {
    name: 'Алексей Лебедев',
    username: '@debtnet_user',
    phone: '+375 29 123-45-67',
    defaultCurrency: 'BYN',
    isPremium: true,
    pushEnabled: true,
    reminderDays: 3,
  },
  contacts: INITIAL_CONTACTS,
  debts: INITIAL_DEBTS,
  groups: INITIAL_GROUPS,

  updateProfile: (data) =>
    set(s => ({ profile: { ...s.profile, ...data } })),

  addContact: (name, phone, messenger, handle) =>
    set(s => ({
      contacts: [...s.contacts, {
        id: genId(),
        name,
        phone,
        messenger,
        messengerHandle: handle,
        initials: initials(name),
        color: CONTACT_COLORS[s.contacts.length % CONTACT_COLORS.length],
        inApp: false,
      }],
    })),

  addDebt: (debt) =>
    set(s => ({
      debts: [{ ...debt, id: genId(), createdAt: new Date().toISOString().slice(0, 10) }, ...s.debts],
    })),

  closeDebt: (id) =>
    set(s => ({
      debts: s.debts.map(d => d.id === id ? { ...d, status: 'closed', closedAt: new Date().toISOString().slice(0, 10) } : d),
    })),

  confirmDebt: (id) =>
    set(s => ({
      debts: s.debts.map(d => d.id === id ? { ...d, status: 'confirmed' } : d),
    })),

  rejectDebt: (id) =>
    set(s => ({ debts: s.debts.filter(d => d.id !== id) })),

  addGroup: (name, emoji, currency, memberIds) =>
    set(s => ({
      groups: [...s.groups, { id: genId(), name, emoji, currency, memberIds, totalBalance: 0, createdAt: new Date().toISOString().slice(0, 10) }],
    })),

  getIncome: (currency) => {
    const debts = get().debts.filter(d => d.direction === 'give' && d.status === 'confirmed');
    if (currency) return debts.filter(d => d.currency === currency).reduce((sum, d) => sum + (d.amount ?? 0), 0);
    return debts.reduce((sum, d) => sum + (d.amount ?? 0), 0);
  },

  getExpenses: (currency) => {
    const debts = get().debts.filter(d => d.direction === 'take' && d.status === 'confirmed');
    if (currency) return debts.filter(d => d.currency === currency).reduce((sum, d) => sum + (d.amount ?? 0), 0);
    return debts.reduce((sum, d) => sum + (d.amount ?? 0), 0);
  },

  getPendingDebts: () => get().debts.filter(d => d.status === 'pending'),
  getClosedDebts: () => get().debts.filter(d => d.status === 'closed'),
}));
