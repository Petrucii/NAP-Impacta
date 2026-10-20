import { useQuery } from '@tanstack/react-query';
import { adminListPosts, getPost, listPosts } from './api';

export function usePosts(category?: string) {
  return useQuery({
    queryKey: ['posts', category ?? 'all'],
    queryFn: () => listPosts(category),
  });
}

export function usePost(slug: string | undefined) {
  return useQuery({
    queryKey: ['post', slug],
    queryFn: () => getPost(slug!),
    enabled: !!slug,
    retry: false,
  });
}

export function useAdminPosts() {
  return useQuery({
    queryKey: ['admin', 'posts'],
    queryFn: adminListPosts,
  });
}
