import Link from "next/link";
import { deleteMeeting } from "@/lib/actions";
import type { SacramentMeeting } from "@/lib/types";
const labels = {
  testimony: "Fast & testimony",
  regular: "Regular meeting",
  stake: "Stake conference",
  general: "General conference",
} as const;
export function MeetingCard({ meeting }: { meeting: SacramentMeeting }) {
  const deleteMeetingWithId = deleteMeeting.bind(null, meeting.id);
  const date = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${meeting.date}T12:00:00Z`));
  return (
    <article className="meeting-card">
      <div>
        <p className="meeting-type">{labels[meeting.meetingType]}</p>
        <h2>
          <Link href={`/meetings/${meeting.id}`}>{date}</Link>
        </h2>
        <p>Conducting: {meeting.conducting}</p>
      </div>
      <div className="card-meta" aria-label="Program summary">
        <span>{meeting.speakers.length} program items</span>
        <span>{meeting.announcements.length} announcements</span>
      </div>
      <div className="meeting-card-actions">
        <Link
          className="text-link"
          href={`/meetings/${meeting.id}`}
          aria-label={`View program for ${date}`}
        >
          View <span aria-hidden="true">→</span>
        </Link>
        <Link
          className="text-link"
          href={`/meetings/${meeting.id}/edit`}
          aria-label={`Edit meeting for ${date}`}
        >
          Edit
        </Link>
        <form action={deleteMeetingWithId}>
          <button
            className="delete-button"
            type="submit"
            aria-label={`Delete meeting for ${date}`}
          >
            Delete
          </button>
        </form>
      </div>
    </article>
  );
}
