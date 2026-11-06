import Link from "next/link";
import type { SacramentMeeting } from "@/lib/types";
const labels = { testimony: "Fast & testimony", regular: "Regular meeting", stake: "Stake conference", general: "General conference" } as const;
export function MeetingCard({ meeting }: { meeting: SacramentMeeting }) {
  const date = new Intl.DateTimeFormat("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric", timeZone: "UTC" }).format(new Date(`${meeting.date}T12:00:00Z`));
  return <article className="meeting-card"><div><p className="meeting-type">{labels[meeting.meetingType]}</p><h2><Link href={`/meetings/${meeting.id}`}>{date}</Link></h2><p>Conducting: {meeting.conducting}</p></div><div className="card-meta" aria-label="Program summary"><span>{meeting.speakers.length} program items</span><span>{meeting.announcements.length} announcements</span></div><Link className="text-link" href={`/meetings/${meeting.id}`} aria-label={`View program for ${date}`}>View program <span aria-hidden="true">→</span></Link></article>;
}
