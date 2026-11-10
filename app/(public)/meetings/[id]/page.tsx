import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MeetingDetail } from "@/components/MeetingDetail";
import { getMeetingById } from "@/lib/meetings-db";

export const instant = false;
type MeetingPageProps = { params: Promise<{ id: string }> };
export async function generateMetadata({
  params,
}: MeetingPageProps): Promise<Metadata> {
  const { id } = await params;
  const meeting = /^\d+$/.test(id) ? await getMeetingById(Number(id)) : null;
  return { title: meeting ? `Meeting · ${meeting.date}` : "Meeting not found" };
}
export default async function MeetingPage({ params }: MeetingPageProps) {
  const { id } = await params;
  if (!/^\d+$/.test(id)) notFound();
  const meeting = await getMeetingById(Number(id));
  if (!meeting) notFound();
  return (
    <main className="shell page-space">
      <MeetingDetail meeting={meeting} />
    </main>
  );
}
