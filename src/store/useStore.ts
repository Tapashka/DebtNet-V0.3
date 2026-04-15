import { create } from 'zustand';
import { TokenPair, loadTokens, setMemTokens } from '../services/api';
import { register, login, logout as authLogout } from '../services/auth';
import { getSummary, getDebtors, createLoan, normalizeDebtor, LoanSummary } from '../services/loans';
import { getContacts, createInvite, acceptInvite, removeContact, ApiContact } from '../services/contacts';
import { sseClient } from '../services/sse';
import { CONTACT_COLORS } from '../constants/theme';
import { Currency } from '../types';

// ── Helpers ───────────────────────────────────
function colorFor(id: string): string {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return CONTACT_COLORS[h % CONTACT_COLORS.length];
}

function ini(name: string): string {
  return name.split(/[\s_@]+/).map(w => w[0] ?? '').join('').toUpperCase().slice(0, 2) || '??';
}

// ── Types ─────────────────────────────────────
export interface Contact {
  id:       string;
  username: string;
  source:   'explicit' | 'loan' | 'mock';
  color:    string;
  initials: string;
}

export interface Debtor {
  id:       string;
  username: string;
  amount:   number;
  color:    string;
  initials: string;
}

export interface UserProfile {
  userId:          string;
  username:        string;
  defaultCurrency: Currency;
  isPremium:       boolean;
  pushEnabled:     boolean;
}

// ── State shape ───────────────────────────────
interface StoreState {
  // Auth
  isAuthed:   boolean;
  isLoading:  boolean;
  authError:  string | null;
  profile:    UserProfile;

  // Data
  summary:    LoanSummary;
  debtors:    Debtor[];
  contacts:   Contact[];

  // Auth actions
  init:       () => Promise<void>;
  doRegister: (email: string, password: string, username?: string) => Promise<void>;
  doLogin:    (email: string, password: string) => Promise<void>;
  doLogout:   () => Promise<void>;
  clearError: () => void;

  // Data actions
  refresh:          () => Promise<void>;
  loadContacts:     () => Promise<void>;
  submitLoan:       (receiverId: string, amount: number, description?: string) => Promise<void>;
  generateInvite:   () => Promise<{ appUrl: string; tgUrl: string }>;
  acceptInviteToken:(token: string) => Promise<string>;
  deleteContact:    (userId: string) => Promise<void>;
}

// ── Store ─────────────────────────────────────
export const useStore = create<StoreState>((set, get) => ({
  isAuthed:  false,
  isLoading: false,
  authError: null,
  profile: {
    userId: '',
    username: '',
    defaultCurrency: 'BYN',
    isPremium: false,
    pushEnabled: true,
  },
  summary:  { balance: 0, total_credit: 0, total_debt: 0 },
  debtors:  [],
  contacts: [],

  // ── Init: called on app start ───────────────
  init: async () => {
    const t = await loadTokens();
    if (!t) return;
    setMemTokens(t);
    set({ isAuthed: true, profile: { ...get().profile, userId: t.user_id } });
    await get().refresh();
    await get().loadContacts();
    get()._startSSE();
  },

  // ── Auth ─────────────────────────────────────
  doRegister: async (email, password, username) => {
    set({ isLoading: true, authError: null });
    try {
      const t = await register({ email, password, username });
      set({
        isAuthed: true,
        isLoading: false,
        profile: { ...get().profile, userId: t.user_id, username: username || email.split('@')[0] },
      });
      await get().refresh();
      await get().loadContacts();
      get()._startSSE();
    } catch (e: unknown) {
      set({ isLoading: false, authError: (e as Error).message });
    }
  },

  doLogin: async (email, password) => {
    set({ isLoading: true, authError: null });
    try {
      const t = await login({ email, password });
      set({
        isAuthed: true,
        isLoading: false,
        profile: { ...get().profile, userId: t.user_id, username: email.split('@')[0] },
      });
      await get().refresh();
      await get().loadContacts();
      get()._startSSE();
    } catch (e: unknown) {
      set({ isLoading: false, authError: (e as Error).message });
    }
  },

  doLogout: async () => {
    sseClient.disconnect();
    await authLogout();
    set({
      isAuthed: false,
      summary:  { balance: 0, total_credit: 0, total_debt: 0 },
      debtors:  [],
      contacts: [],
      profile:  { userId: '', username: '', defaultCurrency: 'BYN', isPremium: false, pushEnabled: true },
    });
  },

  clearError: () => set({ authError: null }),

  // ── Data ──────────────────────────────────────
  refresh: async () => {
    try {
      const [summary, rawDebtors] = await Promise.all([getSummary(), getDebtors()]);
      const debtors: Debtor[] = rawDebtors.map(d => {
        const n = normalizeDebtor(d);
        return { ...n, color: colorFor(n.id), initials: ini(n.username) };
      });
      set({ summary, debtors });
      // merge debtors into contacts if not already there
      const existing = get().contacts.map(c => c.id);
      const newFromDebtors: Contact[] = debtors
        .filter(d => !existing.includes(d.id))
        .map(d => ({ id: d.id, username: d.username, source: 'loan' as const, color: d.color, initials: d.initials }));
      if (newFromDebtors.length) set(s => ({ contacts: [...s.contacts, ...newFromDebtors] }));
    } catch {}
  },

  loadContacts: async () => {
    try {
      const raw: ApiContact[] = await getContacts();
      const contacts: Contact[] = raw.map(c => ({
        id:       c.id,
        username: c.username,
        source:   c.source,
        color:    colorFor(c.id),
        initials: ini(c.username),
      }));
      set({ contacts });
    } catch {}
  },

  submitLoan: async (receiverId, amount, description) => {
    await createLoan({ receiver_id: receiverId, amount, description });
    await get().refresh();
  },

  generateInvite: async () => {
    const data = await createInvite();
    const appUrl = `debtnet://invite?token=${encodeURIComponent(data.token)}`;
    return { appUrl, tgUrl: data.tg_invite_url };
  },

  acceptInviteToken: async (token) => {
    const data = await acceptInvite(token);
    await get().loadContacts();
    return data.contact?.username ?? '';
  },

  deleteContact: async (userId) => {
    await removeContact(userId);
    set(s => ({ contacts: s.contacts.filter(c => c.id !== userId) }));
  },

  // ── SSE (private) ─────────────────────────────
  _startSSE: () => {
    sseClient.setReconnectHandler(() => {
      get().refresh();
      get().loadContacts();
    });
    sseClient.on('loan.transaction.created', () => get().refresh());
    sseClient.on('contact.added',   () => get().loadContacts());
    sseClient.on('contact.removed', (env) => {
      const uid = env.data.contact_user_id as string;
      if (uid) set(s => ({ contacts: s.contacts.filter(c => c.id !== uid) }));
    });
    sseClient.connect();
  },
} as StoreState & { _startSSE: () => void }));
