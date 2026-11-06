import type { Metadata } from "next";
import { MeetingCard } from "@/components/MeetingCard";
import { getMeetings } from "@/lib/meetings-db";
export const metadata: Metadata = { title: "Meeting archive" };
export default function MeetingsPage() { const meetings = getMeetings(); return <main className="shell page-space"><header className="page-heading"><p className="eyebrow">Program archive</p><h1>Sacrament meetings</h1><p>View this Sunday’s program or revisit previous meetings.</p></header><div className="meeting-list">{meetings.map((meeting) => <MeetingCard key={meeting.id} meeting={meeting} />)}</div></main>; }
