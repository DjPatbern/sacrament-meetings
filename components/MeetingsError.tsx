"use client";

import Link from "next/link";
import { useEffect } from "react";

export function MeetingsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Meetings route error:", error);
  }, [error]);

  return (
    <main className="shell page-space">
      <section className="route-message" aria-labelledby="meetings-error-title">
        <p className="eyebrow">Something went wrong</p>
        <h1 id="meetings-error-title">We couldn’t load the meeting planner.</h1>
        <p>
          The problem may be temporary. Try again or return to the meeting list.
        </p>
        <div className="route-message-actions">
          <button
            className="button button-primary"
            type="button"
            onClick={reset}
          >
            Try again
          </button>
          <Link className="button button-secondary" href="/meetings">
            Back to meetings
          </Link>
        </div>
      </section>
    </main>
  );
}
