export default function AsyncBoundary({ status, error, onRetry, children }) {
  if (status === "idle" || status === "loading") {
    return (
      <div className="async-state" role="status" aria-live="polite">
        <div className="async-spinner" aria-hidden="true" />
        <p>Loading products…</p>
      </div>
    );
  }
  if (status === "failed") {
    return (
      <div className="async-state" role="alert">
        <p>⚠ {error}</p>
        <button type="button" className="cv-btn-primary" onClick={onRetry}>
          Try again
        </button>
      </div>
    );
  }
  return children;
}
