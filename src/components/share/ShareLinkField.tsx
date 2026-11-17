import { useEffect, useRef } from 'react';
import { useCopyToClipboard } from '../../hooks/useCopyToClipboard';

interface ShareLinkFieldProps {
  shareUrl: string;
}

const COPY_STATUS_MESSAGES = {
  idle: '',
  copied: 'Link copied to clipboard.',
  failed: 'Copy failed. Select the link and copy it manually.',
} as const;

export function ShareLinkField({ shareUrl }: ShareLinkFieldProps) {
  const { status, copy } = useCopyToClipboard();
  const inputRef = useRef<HTMLInputElement>(null);

  // This field replaces the focused "Save & share" button, so focus moves here instead of dropping to <body>.
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="share-link">
      <label htmlFor="share-url" className="field-label">
        Your link (view only)
      </label>
      <div className="share-link__row">
        <input
          ref={inputRef}
          id="share-url"
          className="text-input"
          type="url"
          value={shareUrl}
          readOnly
          onFocus={(event) => event.currentTarget.select()}
        />
        <button type="button" className="button button--secondary" onClick={() => void copy(shareUrl)}>
          Copy
        </button>
      </div>
      <p className="field-hint" role="status">
        {COPY_STATUS_MESSAGES[status]}
      </p>
    </div>
  );
}
