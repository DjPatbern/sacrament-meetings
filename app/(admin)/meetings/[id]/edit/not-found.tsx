import Link from "next/link";

export default function EditMeetingNotFound() {
  return (
    <main className="shell page-space">
      <section
        className="route-message"
        aria-labelledby="missing-meeting-title"
      >
        <p className="eyebrow">Meeting not found</p>
        <h1 id="missing-meeting-title">We couldn’t find that meeting.</h1>
        <p>It may have been deleted, or the meeting ID may be incorrect.</p>
        <Link className="button button-primary" href="/meetings">
          Return to meetings
        </Link>
      </section>
    </main>
  );
}
