import { useCallback, useEffect, useState } from 'react';
import { isFirebaseConfigured } from '../lib/firebase/firebaseConfig';
import type { RingConfig } from '../lib/ringConfig';

export type SharedDesignState =
  | { status: 'loading' }
  | { status: 'ready'; config: RingConfig }
  | { status: 'not-found' }
  | { status: 'invalid' }
  | { status: 'not-configured' }
  | { status: 'error'; message: string };

type ResolvedState = { designId: string; state: SharedDesignState };

const LOAD_FAILED_MESSAGE = 'We could not load this design. Check your connection and try again.';

/** Loads a shared design by id. Results are keyed by id so a new id reads as loading without a reset. */
export function useSharedDesign(designId: string | null) {
  const [resolved, setResolved] = useState<ResolvedState | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!designId || !isFirebaseConfigured) return;

    let isCurrent = true;
    const settle = (state: SharedDesignState) => {
      if (isCurrent) setResolved({ designId, state });
    };

    import('../lib/firebase/designsRepository')
      .then(({ loadDesign }) => loadDesign(designId))
      .then((result) => {
        if (result.kind === 'found') settle({ status: 'ready', config: result.config });
        else settle({ status: result.kind });
      })
      .catch((error: unknown) => {
        console.error('Failed to load shared design', error);
        settle({ status: 'error', message: LOAD_FAILED_MESSAGE });
      });

    return () => {
      isCurrent = false;
    };
  }, [designId, attempt]);

  const retry = useCallback(() => {
    setResolved(null);
    setAttempt((count) => count + 1);
  }, []);

  return { state: resolveState(designId, resolved), retry };
}

function resolveState(designId: string | null, resolved: ResolvedState | null): SharedDesignState | null {
  if (!designId) return null;
  if (!isFirebaseConfigured) return { status: 'not-configured' };
  if (resolved?.designId !== designId) return { status: 'loading' };
  return resolved.state;
}
