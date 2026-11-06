import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MeetingDetail } from "@/components/MeetingDetail";
import { getMeetingById, getMeetings } from "@/lib/meetings-db";
export function generateStaticParams() { return getMeetings().map((meeting) => ({ id: String(meeting.id) })); }
type MeetingPageProps = { params: Promise<{ id: string }> };
export async function generateMetadata({ params }: MeetingPageProps): Promise<Metadata> { const { id } = await params; const meeting = getMeetingById(Number(id)); return { title: meeting ? `Meeting · ${meeting.date}` : "Meeting not found" }; }
export default async function MeetingPage({ params }: MeetingPageProps) { const { id } = await params; if (!/^\d+$/.test(id)) notFound(); const meeting = getMeetingById(Number(id)); if (!meeting) notFound(); return <main className="shell page-space"><MeetingDetail meeting={meeting} /></main>; }
