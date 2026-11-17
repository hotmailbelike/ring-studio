import { useSyncExternalStore } from 'react';
import { getPathname, subscribeToNavigation } from '../lib/navigation';

export function usePathname(): string {
  return useSyncExternalStore(subscribeToNavigation, getPathname);
}
