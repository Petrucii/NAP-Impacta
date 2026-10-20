import { api } from '@/lib/api';
import type { ContactMessage, Paginated } from '@/types/api';

export type ContactInput = {
  name: string;
  email: string;
  topic: string;
  message: string;
  isAnonymous: boolean;
  website?: string; // honeypot
};

export async function submitContact(input: ContactInput) {
  const resp = await api.post<{ id: string; receivedAt: string }>('/contact', input);
  return resp.data;
}

export async function submitFeedback(input: { rating: number; comment?: string; pageSlug?: string }) {
  const resp = await api.post<{ id: string }>('/feedback', input);
  return resp.data;
}

export async function adminListMessages(params: { handled?: boolean; limit?: number; offset?: number } = {}) {
  const resp = await api.get<Paginated<ContactMessage>>('/admin/messages', { params });
  return resp.data;
}

export async function adminHandleMessage(id: string, handled: boolean) {
  const resp = await api.patch<ContactMessage>(`/admin/messages/${id}`, { handled });
  return resp.data;
}
