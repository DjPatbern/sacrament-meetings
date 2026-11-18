import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MeetingForm } from "@/components/MeetingForm";
import { updateMeeting } from "@/lib/actions";
import { getMeetingById } from "@/lib/meetings-db";

export const metadata: Metadata = { title: "Edit meeting" };
export const instant = false;

export default async function EditMeetingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!/^\d+$/.test(id)) notFound();
  const meetingId = Number(id);
  const meeting = await getMeetingById(meetingId);
  if (!meeting) notFound();
  const updateMeetingWithId = updateMeeting.bind(null, meetingId);

  return (
    <main className="shell page-space">
      <header className="form-page-heading">
        <p className="eyebrow">Leader tools</p>
        <h1>Edit meeting</h1>
        <p>Update the program for {meeting.date}.</p>
      </header>
      <MeetingForm
        action={updateMeetingWithId}
        meeting={meeting}
        submitLabel="Save changes"
      />
    </main>
  );
}
