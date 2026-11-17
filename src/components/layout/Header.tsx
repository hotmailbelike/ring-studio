import type { MouseEvent } from 'react';
import { RING_OPTIONS_PANEL_ID } from '../../lib/landmarks';
import { navigate } from '../../lib/navigation';
import { LogoMark } from './LogoMark';

const PRIMARY_MOUSE_BUTTON = 0;

/** Plain left clicks navigate in place; modified or middle clicks keep the browser's new tab/window behavior. */
function isPlainLeftClick(event: MouseEvent<HTMLAnchorElement>): boolean {
  const hasModifier = event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
  return event.button === PRIMARY_MOUSE_BUTTON && !hasModifier;
}

export function Header() {
  const goHome = (event: MouseEvent<HTMLAnchorElement>) => {
    if (!isPlainLeftClick(event)) return;
    event.preventDefault();
    navigate('/');
  };

  return (
    <header className="site-header">
      <a className="skip-link" href={`#${RING_OPTIONS_PANEL_ID}`}>
        Skip to ring options
      </a>
      <h1 className="brand">
        <a href="/" className="brand__link" onClick={goHome}>
          <LogoMark />
          Ring Studio
        </a>
      </h1>
      <p className="site-header__tagline">Design a ring in 3D and see an estimated price.</p>
    </header>
  );
}
