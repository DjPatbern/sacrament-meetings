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
  if (!meeting) {
    return {
      title: "Meeting not found",
      description: "The requested sacrament meeting program was not found.",
    };
  }

  const description = `Sacrament meeting program for ${meeting.date}, conducted by ${meeting.conducting}.`;

  return {
    title: `Meeting · ${meeting.date}`,
    description,
    openGraph: {
      title: `Sacrament meeting · ${meeting.date}`,
      description,
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
