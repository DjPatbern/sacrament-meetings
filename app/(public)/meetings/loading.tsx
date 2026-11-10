export default function Loading() {
  return (
    <main className="shell page-space" aria-live="polite">
      <span className="sr-only">Loading meeting archive…</span>
      <div className="meeting-skeletons" aria-hidden="true">
        <div className="search-skeleton" />
        {[1, 2, 3].map((item) => (
          <div className="meeting-skeleton" key={item}>
            <span />
            <strong />
            <span />
          </div>
        ))}
      </div>
    </main>
  );
}
