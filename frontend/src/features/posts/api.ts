import { api } from '@/lib/api';
import type { Paginated, Post } from '@/types/api';

export async function listPosts(category?: string, limit = 12, offset = 0) {
  const resp = await api.get<Paginated<Post>>('/posts', {
    params: { category, limit, offset },
  });
  return resp.data;
}

export async function getPost(slug: string) {
  const resp = await api.get<Post>(`/posts/${slug}`);
  return resp.data;
}

export async function adminListPosts() {
  const resp = await api.get<Post[]>('/admin/posts');
  return resp.data;
}

export async function adminCreatePost(input: Partial<Post>) {
  const resp = await api.post<Post>('/admin/posts', input);
  return resp.data;
}

export async function adminUpdatePost(id: string, input: Partial<Post> & { publish?: boolean }) {
  const resp = await api.patch<Post>(`/admin/posts/${id}`, input);
  return resp.data;
}

export async function adminDeletePost(id: string) {
  await api.delete(`/admin/posts/${id}`);
}
