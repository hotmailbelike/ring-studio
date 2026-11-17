export type DownloadStatus = 'idle' | 'working' | 'failed';

interface ViewerToolbarProps {
  downloadStatus: DownloadStatus;
  onDownload: () => void;
  onResetView: () => void;
}

export function ViewerToolbar({ downloadStatus, onDownload, onResetView }: ViewerToolbarProps) {
  const isWorking = downloadStatus === 'working';

  return (
    <div className="viewer-toolbar">
      <p className="viewer-toolbar__hint">Drag to rotate · scroll or pinch to zoom · arrow keys and +/− when focused</p>
      <div className="viewer-toolbar__actions">
        <button type="button" className="button button--ghost" onClick={onResetView}>
          Reset view
        </button>
        <button type="button" className="button button--secondary" onClick={onDownload} disabled={isWorking}>
          {isWorking ? 'Preparing…' : 'Download PNG'}
        </button>
      </div>
      <p className="viewer-toolbar__status" role="status">
        {downloadStatus === 'failed' ? 'The image could not be created. Please try again.' : ''}
      </p>
    </div>
  );
}
