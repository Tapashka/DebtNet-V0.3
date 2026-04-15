import { api } from './api';

export type ContactSource = 'explicit' | 'loan';

export interface ApiContact {
  id:       string;
  username: string;
  source:   ContactSource;
}

export interface InviteResponse {
  token:         string;
  tg_invite_url: string;
}

export async function getContacts(): Promise<ApiContact[]> {
  const data = await api.get<{ contacts: ApiContact[] } | ApiContact[]>('/contacts');
  return Array.isArray(data) ? data : (data.contacts ?? []);
}

export function createInvite(): Promise<InviteResponse> {
  return api.post<InviteResponse>('/contacts/invites');
}

export function acceptInvite(token: string) {
  return api.post<{ accepted: boolean; contact: ApiContact }>(
    `/contacts/invites/${token}/accept`
  );
}

export function removeContact(userId: string) {
  return api.delete<{ removed: boolean }>(`/contacts/${userId}`);
}
