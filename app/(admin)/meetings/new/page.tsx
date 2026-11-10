import type { Metadata } from "next";

export const metadata: Metadata = { title: "Create meeting" };

export default function NewMeetingPage() {
  return (
    <main className="shell page-space">
      <div className="admin-placeholder">
        <p className="eyebrow">Leader tools</p>
        <h1>Create Meeting — Coming in Week 04</h1>
        <p>
          The authenticated meeting form will be added here in the next phase.
        </p>
      </div>
    </main>
  );
}
