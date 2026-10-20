import { api } from '@/lib/api';
import type { Paginated, Service } from '@/types/api';

export async function listServices() {
  const resp = await api.get<Paginated<Service>>('/services');
  return resp.data;
}

export async function getService(slug: string) {
  const resp = await api.get<Service>(`/services/${slug}`);
  return resp.data;
}

export async function adminListServices() {
  const resp = await api.get<Service[]>('/admin/services');
  return resp.data;
}

export async function adminCreateService(input: Partial<Service>) {
  const resp = await api.post<Service>('/admin/services', input);
  return resp.data;
}

export async function adminUpdateService(id: string, input: Partial<Service>) {
  const resp = await api.patch<Service>(`/admin/services/${id}`, input);
  return resp.data;
}

export async function adminDeleteService(id: string) {
  await api.delete(`/admin/services/${id}`);
}
