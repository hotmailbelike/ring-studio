export function ViewerLoading() {
  return (
    <div className="viewer-message" role="status">
      <span className="spinner" aria-hidden="true" />
      <p className="viewer-message__body">Loading the 3D studio…</p>
    </div>
  );
}
