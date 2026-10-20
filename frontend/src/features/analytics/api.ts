import { api } from '@/lib/api';

/** Dispara track view silenciosamente — nunca quebra o render se falhar. */
export async function trackView(route: string): Promise<void> {
  try {
    await api.post('/track/view', { route });
  } catch {
    // nop
  }
}
