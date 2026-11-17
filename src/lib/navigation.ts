const NAVIGATION_EVENT = 'ring-studio:navigate';

// Firestore auto-generated ids are 20 characters of [A-Za-z0-9].
const SHARED_DESIGN_PATH = /^\/d\/([^/]+)\/?$/;
const FIRESTORE_AUTO_ID = /^[A-Za-z0-9]{20}$/;

export type AppRoute =
  | { kind: 'editor' }
  | { kind: 'shared'; designId: string }
  | { kind: 'shared-invalid' };

export function getPathname(): string {
  return window.location.pathname;
}

export function subscribeToNavigation(onChange: () => void): () => void {
  window.addEventListener('popstate', onChange);
  window.addEventListener(NAVIGATION_EVENT, onChange);
  return () => {
    window.removeEventListener('popstate', onChange);
    window.removeEventListener(NAVIGATION_EVENT, onChange);
  };
}

export function navigate(path: string): void {
  if (path === window.location.pathname) return;
  window.history.pushState(null, '', path);
  window.dispatchEvent(new Event(NAVIGATION_EVENT));
}

export function parseRoute(pathname: string): AppRoute {
  const match = SHARED_DESIGN_PATH.exec(pathname);
  if (!match) return { kind: 'editor' };

  const designId = match[1] ?? '';
  return FIRESTORE_AUTO_ID.test(designId) ? { kind: 'shared', designId } : { kind: 'shared-invalid' };
}

export function buildSharedDesignUrl(designId: string): string {
  return `${window.location.origin}/d/${designId}`;
}
