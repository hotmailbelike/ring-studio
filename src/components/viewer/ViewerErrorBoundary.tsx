import { Component, type ErrorInfo, type ReactNode } from 'react';

interface ViewerErrorBoundaryProps {
  children: ReactNode;
}

interface ViewerErrorBoundaryState {
  hasError: boolean;
}

/** Keeps the controls and price usable if the 3D viewer fails to load or render. */
export class ViewerErrorBoundary extends Component<ViewerErrorBoundaryProps, ViewerErrorBoundaryState> {
  state: ViewerErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ViewerErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('3D viewer crashed', error, info.componentStack);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="viewer-message" role="alert">
        <p className="viewer-message__title">The 3D preview couldn’t load.</p>
        <p className="viewer-message__body">You can still configure the ring and see its price.</p>
        <button type="button" className="button button--secondary" onClick={() => window.location.reload()}>
          Reload page
        </button>
      </div>
    );
  }
}
