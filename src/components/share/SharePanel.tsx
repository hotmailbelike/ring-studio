import { useSaveDesign } from '../../hooks/useSaveDesign';
import { isFirebaseConfigured } from '../../lib/firebase/firebaseConfig';
import { areRingConfigsEqual, type RingConfig } from '../../lib/ringConfig';
import { ShareLinkField } from './ShareLinkField';

interface SharePanelProps {
  config: RingConfig;
}

function SharingUnavailable() {
  return (
    <>
      <button type="button" className="button button--primary button--block" disabled>
        Save &amp; share
      </button>
      <p className="field-hint">Sharing is turned off in this build because Firebase isn’t configured.</p>
    </>
  );
}

function SaveAndShare({ config }: SharePanelProps) {
  const { state, save } = useSaveDesign();
  const isSaving = state.status === 'saving';

  // A link only describes the exact design that was saved; any later change needs a new save.
  const isLinkCurrent = state.status === 'saved' && areRingConfigsEqual(state.config, config);
  if (state.status === 'saved' && isLinkCurrent) return <ShareLinkField shareUrl={state.shareUrl} />;

  return (
    <>
      <button
        type="button"
        className="button button--primary button--block"
        onClick={() => void save(config)}
        disabled={isSaving}
        aria-busy={isSaving}
      >
        {isSaving ? 'Saving…' : 'Save & share'}
      </button>
      {state.status === 'error' ? (
        <p className="field-error" role="alert">
          {state.message}
        </p>
      ) : (
        <p className="field-hint">Saves only the options above and gives you a view-only link.</p>
      )}
    </>
  );
}

export function SharePanel({ config }: SharePanelProps) {
  return (
    <section className="panel-section" aria-labelledby="share-heading">
      <h2 id="share-heading" className="section-title">
        Share
      </h2>
      {isFirebaseConfigured ? <SaveAndShare config={config} /> : <SharingUnavailable />}
    </section>
  );
}
