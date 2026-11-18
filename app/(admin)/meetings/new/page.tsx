import type { Metadata } from "next";
import { MeetingForm } from "@/components/MeetingForm";
import { createMeeting } from "@/lib/actions";

export const metadata: Metadata = { title: "Create meeting" };

export default function NewMeetingPage() {
  return (
    <main className="shell page-space">
      <header className="form-page-heading">
        <p className="eyebrow">Leader tools</p>
        <h1>Create a meeting</h1>
        <p>
          Prepare the complete sacrament meeting program for an upcoming Sunday.
        </p>
      </header>
      <MeetingForm action={createMeeting} submitLabel="Create meeting" />
    </main>
  );
}
