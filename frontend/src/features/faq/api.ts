import { api } from '@/lib/api';
import type { FaqItem } from '@/types/api';

export async function listFaq() {
  const resp = await api.get<FaqItem[]>('/faq');
  return resp.data;
}
