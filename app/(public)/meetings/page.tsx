import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { Suspense } from "react";
import { auth } from "@/auth";
import { MeetingCard } from "@/components/MeetingCard";
import { MeetingSearch } from "@/components/MeetingSearch";
import { Pagination } from "@/components/Pagination";
import { getMeetings, getMeetingsTotalPages } from "@/lib/meetings-db";

export const metadata: Metadata = {
  title: "Meeting archive",
  description:
    "Browse current and past Meadowbrook Ward sacrament meeting programs.",
  openGraph: {
    title: "Meeting archive | Meadowbrook Ward",
    description:
      "Browse current and past Meadowbrook Ward sacrament meeting programs.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Meadowbrook Ward Sacrament Meeting Planner",
      },
    ],
  },
};

type MeetingsSearchParams = Promise<{ query?: string; page?: string }>;

async function MeetingResults({
  searchParams,
}: {
  searchParams: MeetingsSearchParams;
}) {
  await connection();
  const params = await searchParams;
  const query = params.query?.trim() ?? "";
  const requestedPage = Number.parseInt(params.page ?? "1", 10);
  const normalizedPage = Number.isFinite(requestedPage)
    ? Math.max(1, requestedPage)
    : 1;
  const [session, totalPages] = await Promise.all([
    auth(),
    getMeetingsTotalPages(query),
  ]);
  const currentPage = Math.min(normalizedPage, totalPages);
  const meetings = await getMeetings(query, currentPage);

  return (
    <>
      <MeetingSearch />
      {meetings.length > 0 ? (
        <div className="meeting-list" aria-live="polite">
          {meetings.map((meeting) => (
            <MeetingCard
              key={meeting.id}
              meeting={meeting}
              canManage={Boolean(session?.user)}
            />
          ))}
        </div>
      ) : (
        <div className="empty-results" role="status">
          <h2>No meetings found</h2>
          <p>Try another speaker, leader, or meeting type.</p>
        </div>
      )}
      <Pagination totalPages={totalPages} />
    </>
  );
}

function ResultsSkeleton() {
  return (
    <div className="loading-card" aria-live="polite">
      <span className="spinner" aria-hidden="true" />
      Loading meeting archive…
    </div>
  );
}

export default function MeetingsPage({
  searchParams,
}: {
  searchParams: MeetingsSearchParams;
}) {
  return (
    <main className="shell page-space">
      <header className="page-heading page-heading-actions">
        <div>
          <p className="eyebrow">Program archive</p>
          <h1>Sacrament meetings</h1>
          <p>View this Sunday’s program or revisit previous meetings.</p>
        </div>
        <Suspense fallback={null}>
          <CreateMeetingLink />
        </Suspense>
      </header>
      <Suspense fallback={<ResultsSkeleton />}>
        <MeetingResults searchParams={searchParams} />
      </Suspense>
    </main>
  );
}

async function CreateMeetingLink() {
  await connection();
  const session = await auth();

  return session?.user ? (
    <Link className="button button-primary" href="/meetings/new">
      Create meeting
    </Link>
  ) : (
    <Link className="button button-secondary" href="/login">
      Bishopric sign in
    </Link>
  );
}
