import { useCallback, useEffect, useRef, useState } from 'react';

const COPIED_FEEDBACK_MS = 2000;

export type CopyStatus = 'idle' | 'copied' | 'failed';

export function useCopyToClipboard() {
  const [status, setStatus] = useState<CopyStatus>('idle');
  const resetTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(resetTimer.current), []);

  const copy = useCallback(async (text: string) => {
    clearTimeout(resetTimer.current);
    try {
      await navigator.clipboard.writeText(text);
      setStatus('copied');
    } catch {
      setStatus('failed');
    }
    resetTimer.current = setTimeout(() => setStatus('idle'), COPIED_FEEDBACK_MS);
  }, []);

  return { status, copy };
}
