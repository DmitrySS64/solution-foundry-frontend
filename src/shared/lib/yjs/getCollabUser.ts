//shared/lib/yjs/getCollabUser
import type { Awareness } from 'y-protocols/awareness';
//не используется
export function getCollabUser(params?: {
  name?: string;
  color?: string;
  avatarText?: string;
}): { name: string; color: string; avatarText?: string } {
  return {
    name: params?.name ?? 'You',
    color: params?.color ?? 'bg-blue-500',
    avatarText: params?.avatarText,
  };
}

export function setAwarenessUser(
  awareness: Awareness,
  user: { name: string; color: string; avatarText?: string },
) {
  awareness.setLocalStateField('user', user);
}

