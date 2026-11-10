"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

export function Pagination({ totalPages }: { totalPages: number }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const requestedPage = Number.parseInt(searchParams.get("page") ?? "1", 10);
  const currentPage = Math.min(
    totalPages,
    Number.isFinite(requestedPage) ? Math.max(1, requestedPage) : 1,
  );

  function createPageURL(page: number): string {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    return `${pathname}?${params.toString()}`;
  }

  const linkClasses =
    "inline-flex min-h-11 items-center justify-center rounded-full border border-purple-200 bg-white px-5 py-2 font-bold text-purple-800 transition hover:border-purple-400 hover:bg-purple-50 focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-purple-500";

  return (
    <nav
      aria-label="Pagination"
      className="mt-8 flex flex-wrap items-center justify-between gap-4"
    >
      <span>
        {currentPage > 1 ? (
          <Link className={linkClasses} href={createPageURL(currentPage - 1)}>
            <span aria-hidden="true">←</span>&nbsp; Previous
          </Link>
        ) : (
          <span aria-hidden="true" />
        )}
      </span>
      <span className="font-semibold text-purple-950" aria-live="polite">
        Page {currentPage} of {totalPages}
      </span>
      <span>
        {currentPage < totalPages ? (
          <Link className={linkClasses} href={createPageURL(currentPage + 1)}>
            Next &nbsp;<span aria-hidden="true">→</span>
          </Link>
        ) : (
          <span aria-hidden="true" />
        )}
      </span>
    </nav>
  );
}
