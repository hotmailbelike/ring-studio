import { useCallback, useState } from 'react';
import { buildSharedDesignUrl } from '../lib/navigation';
import type { RingConfig } from '../lib/ringConfig';
import { TimeoutError } from '../lib/withTimeout';

export type SaveDesignState =
  | { status: 'idle' }
  | { status: 'saving' }
  | { status: 'saved'; config: RingConfig; shareUrl: string }
  | { status: 'error'; message: string };

const SAVE_FAILED_MESSAGE = 'Saving failed. Please try again in a moment.';

export function useSaveDesign() {
  const [state, setState] = useState<SaveDesignState>({ status: 'idle' });

  const save = useCallback(async (config: RingConfig) => {
    setState({ status: 'saving' });
    try {
      const { saveDesign } = await import('../lib/firebase/designsRepository');
      const designId = await saveDesign(config);
      setState({ status: 'saved', config, shareUrl: buildSharedDesignUrl(designId) });
    } catch (error: unknown) {
      console.error('Failed to save design', error);
      const message = error instanceof TimeoutError ? error.message : SAVE_FAILED_MESSAGE;
      setState({ status: 'error', message });
    }
  }, []);

  return { state, save };
}
