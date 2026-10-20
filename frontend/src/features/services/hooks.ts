import { useQuery } from '@tanstack/react-query';
import { getService, listServices, adminListServices } from './api';

export function useServices() {
  return useQuery({
    queryKey: ['services'],
    queryFn: listServices,
  });
}

export function useService(slug: string | undefined) {
  return useQuery({
    queryKey: ['service', slug],
    queryFn: () => getService(slug!),
    enabled: !!slug,
    retry: false,
  });
}

export function useAdminServices() {
  return useQuery({
    queryKey: ['admin', 'services'],
    queryFn: adminListServices,
  });
}
