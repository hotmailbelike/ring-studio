interface StatusAction {
  label: string;
  onClick: () => void;
}

interface StatusScreenProps {
  title: string;
  message: string;
  isLoading?: boolean;
  primaryAction?: StatusAction;
  secondaryAction?: StatusAction;
}

export function StatusScreen({ title, message, isLoading = false, primaryAction, secondaryAction }: StatusScreenProps) {
  return (
    <section className="status-screen" role={isLoading ? 'status' : undefined} aria-labelledby="status-title">
      <div className="status-card">
        {isLoading && <span className="spinner" aria-hidden="true" />}
        <h2 id="status-title" className="status-card__title">
          {title}
        </h2>
        <p className="status-card__message">{message}</p>
        {(primaryAction ?? secondaryAction) && (
          <div className="status-card__actions">
            {primaryAction && (
              <button type="button" className="button button--primary" onClick={primaryAction.onClick}>
                {primaryAction.label}
              </button>
            )}
            {secondaryAction && (
              <button type="button" className="button button--ghost" onClick={secondaryAction.onClick}>
                {secondaryAction.label}
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
