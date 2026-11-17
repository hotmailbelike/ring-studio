import { useEffect } from 'react';

interface Disposable {
  dispose: () => void;
}

/** Frees GPU memory for a memoized three.js resource once it is replaced or unmounted. */
export function useDisposable(resource: Disposable): void {
  useEffect(() => () => resource.dispose(), [resource]);
}
