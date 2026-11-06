import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page not found",
  description: "The requested sacrament meeting page could not be found.",
};

export default function NotFound() {
  return (
    <main className="not-found-page shell">
      <section className="not-found-card" aria-labelledby="not-found-title">
        <div className="not-found-art" aria-hidden="true">
          <span>4</span>
          <span className="not-found-symbol">✦</span>
          <span>4</span>
        </div>
        <p className="eyebrow">Page not found</p>
        <h1 id="not-found-title">This program isn’t in the meetinghouse.</h1>
        <p className="not-found-copy">
          The page may have moved, or the meeting number may not exist. Return
          to the archive and choose another Sunday.
        </p>
        <div className="not-found-actions">
          <Link className="button button-primary" href="/meetings">
            Browse meetings
          </Link>
          <Link className="button button-secondary" href="/">
            Return home 
          </Link>
        </div>
      </section>
    </main>
  );
}
