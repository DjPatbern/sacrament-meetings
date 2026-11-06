export default function Loading() {
  return (
    <main className="shell page-space" aria-live="polite">
      <div className="loading-card">
        <span className="spinner" aria-hidden="true" />
        Loading meeting program…
      </div>
    </main>
  );
}
