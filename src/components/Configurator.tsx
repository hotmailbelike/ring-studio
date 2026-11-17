import { lazy, Suspense, useMemo } from 'react';
import { RING_OPTIONS_PANEL_ID } from '../lib/landmarks';
import type { RingConfig } from '../lib/ringConfig';
import { computeRingDimensions } from '../lib/ringDimensions';
import { DesignControls } from './controls/DesignControls';
import { PresetsRow } from './controls/PresetsRow';
import { PriceEstimatePanel } from './pricing/PriceEstimatePanel';
import { SharedDesignBanner } from './share/SharedDesignBanner';
import { SharePanel } from './share/SharePanel';
import { ViewerErrorBoundary } from './viewer/ViewerErrorBoundary';
import { ViewerLoading } from './viewer/ViewerLoading';

// three.js is the heaviest dependency, so the viewer loads in its own chunk after the controls render.
const RingViewer = lazy(() => import('./viewer/RingViewer'));

type ConfiguratorProps =
  | { mode: 'edit'; config: RingConfig; onConfigChange: (update: Partial<RingConfig>) => void }
  | { mode: 'view'; config: RingConfig; onMakeCopy: () => void };

export function Configurator(props: ConfiguratorProps) {
  const { config } = props;
  const dimensions = useMemo(() => computeRingDimensions(config), [config]);

  return (
    <div className="workspace">
      <section className="workspace__viewer" aria-label="3D preview">
        <ViewerErrorBoundary>
          <Suspense fallback={<ViewerLoading />}>
            <RingViewer config={config} />
          </Suspense>
        </ViewerErrorBoundary>
      </section>

      <aside id={RING_OPTIONS_PANEL_ID} className="workspace__panel sheet" aria-label="Ring options" tabIndex={-1}>
        <div className="sheet__handle" aria-hidden="true" />
        {props.mode === 'view' ? (
          <SharedDesignBanner onMakeCopy={props.onMakeCopy} />
        ) : (
          <PresetsRow currentConfig={config} onSelect={(preset) => props.onConfigChange(preset)} />
        )}
        <DesignControls config={config} onChange={props.mode === 'edit' ? props.onConfigChange : undefined} />
        <PriceEstimatePanel config={config} dimensions={dimensions} />
        {props.mode === 'edit' && <SharePanel config={config} />}
      </aside>
    </div>
  );
}
