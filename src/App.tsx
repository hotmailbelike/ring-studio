import { useCallback, useEffect, useRef, useState } from 'react';
import { Configurator } from './components/Configurator';
import { Footer } from './components/layout/Footer';
import { Header } from './components/layout/Header';
import { StatusScreen } from './components/layout/StatusScreen';
import { usePathname } from './hooks/usePathname';
import { useSharedDesign } from './hooks/useSharedDesign';
import { RING_OPTIONS_PANEL_ID } from './lib/landmarks';
import { navigate, parseRoute } from './lib/navigation';
import { DEFAULT_RING_CONFIG } from './lib/presets';
import type { RingConfig } from './lib/ringConfig';

const EDITOR_PATH = '/';

export function App() {
  const route = parseRoute(usePathname());
  const sharedDesignId = route.kind === 'shared' ? route.designId : null;
  const { state: sharedDesign, retry } = useSharedDesign(sharedDesignId);

  const [config, setConfig] = useState<RingConfig>(DEFAULT_RING_CONFIG);
  const updateConfig = useCallback((update: Partial<RingConfig>) => {
    setConfig((current) => ({ ...current, ...update }));
  }, []);

  // "Make a copy / edit" unmounts its own button, so focus moves to the options panel once the editor renders.
  const shouldFocusPanelRef = useRef(false);
  useEffect(() => {
    if (route.kind !== 'editor' || !shouldFocusPanelRef.current) return;
    shouldFocusPanelRef.current = false;
    document.getElementById(RING_OPTIONS_PANEL_ID)?.focus();
  }, [route.kind]);

  const startNewDesign = useCallback(() => navigate(EDITOR_PATH), []);
  const editCopy = useCallback((sharedConfig: RingConfig) => {
    setConfig(sharedConfig);
    shouldFocusPanelRef.current = true;
    navigate(EDITOR_PATH);
  }, []);

  const startNewAction = { label: 'Start a new design', onClick: startNewDesign };

  function renderSharedDesign() {
    switch (sharedDesign?.status) {
      case 'ready':
        return (
          <Configurator mode="view" config={sharedDesign.config} onMakeCopy={() => editCopy(sharedDesign.config)} />
        );
      case 'not-found':
        return (
          <StatusScreen
            title="Design not found"
            message="This link doesn’t match a saved design. It may have been mistyped."
            primaryAction={startNewAction}
          />
        );
      case 'invalid':
        return (
          <StatusScreen
            title="This design can’t be opened"
            message="The saved design has values this version of Ring Studio doesn’t recognize."
            primaryAction={startNewAction}
          />
        );
      case 'not-configured':
        return (
          <StatusScreen
            title="Sharing isn’t set up"
            message="This copy of Ring Studio was built without a Firebase project, so shared links can’t be opened."
            primaryAction={startNewAction}
          />
        );
      case 'error':
        return (
          <StatusScreen
            title="Couldn’t load this design"
            message={sharedDesign.message}
            primaryAction={{ label: 'Try again', onClick: retry }}
            secondaryAction={startNewAction}
          />
        );
      default:
        return <StatusScreen title="Loading design" message="Fetching the shared ring…" isLoading />;
    }
  }

  function renderContent() {
    if (route.kind === 'editor') {
      return <Configurator mode="edit" config={config} onConfigChange={updateConfig} />;
    }
    if (route.kind === 'shared-invalid') {
      return (
        <StatusScreen
          title="Design not found"
          message="This link isn’t a valid Ring Studio design link."
          primaryAction={startNewAction}
        />
      );
    }
    return renderSharedDesign();
  }

  return (
    <div className="app">
      <Header />
      <main className="app__main">{renderContent()}</main>
      <Footer />
    </div>
  );
}
