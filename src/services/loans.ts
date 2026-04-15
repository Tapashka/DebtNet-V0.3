import { api } from './api';

export interface LoanSummary {
  balance:       number;
  total_credit:  number;
  total_debt:    number;
}

export interface Debtor {
  user_id:       string;
  username:      string;
  amount:        number;
  // может приходить в разных форматах — нормализуем
  counterparty_id?: string;
  counterparty?:    { id: string; username: string };
  user?:            { id: string; username: string };
}

export interface CreateLoanParams {
  receiver_id:  string;
  amount:       number;
  description?: string;
}

export function getSummary() {
  return api.get<LoanSummary>('/loans/summary');
}

export async function getDebtors(): Promise<Debtor[]> {
  const data = await api.get<Debtor[] | { debtors: Debtor[] }>('/loans/debtors');
  return Array.isArray(data) ? data : (data.debtors ?? []);
}

export function createLoan(params: CreateLoanParams) {
  return api.post('/loans', params);
}

// Нормализация объекта должника в единый формат
export function normalizeDebtor(d: Debtor): { id: string; username: string; amount: number } {
  const id =
    d.user_id ||
    d.counterparty_id ||
    d.counterparty?.id ||
    d.user?.id ||
    '';
  const username =
    d.username ||
    d.counterparty?.username ||
    d.user?.username ||
    '?';
  return { id, username, amount: d.amount ?? 0 };
}
