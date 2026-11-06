import type { Hymn, SacramentMeeting } from "@/lib/types";
import { PrintButton } from "./PrintButton";
function HymnText({ hymn }: { hymn: Hymn }) { return <><span className="hymn-number">Hymn {hymn.number}</span> {hymn.title}</>; }
export function MeetingDetail({ meeting }: { meeting: SacramentMeeting }) {
  const date = new Intl.DateTimeFormat("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric", timeZone: "UTC" }).format(new Date(`${meeting.date}T12:00:00Z`));
  return <article className="program">
    <header className="program-header"><div><p className="eyebrow">Sacrament meeting program</p><h1>{date}</h1><p>Meadowbrook Ward · 10:00 AM</p></div><PrintButton /></header>
    <section className="program-leadership" aria-labelledby="leadership-heading"><h2 id="leadership-heading" className="sr-only">Meeting leadership</h2><dl><div><dt>Presiding</dt><dd>{meeting.presiding}</dd></div><div><dt>Conducting</dt><dd>{meeting.conducting}</dd></div></dl></section>
    <div className="program-grid"><section className="agenda" aria-labelledby="agenda-heading"><h2 id="agenda-heading">Order of worship</h2><ol className="agenda-list">
      <li><span>Opening hymn</span><strong><HymnText hymn={meeting.openingHymn} /></strong></li><li><span>Invocation</span><strong>{meeting.openingPrayer}</strong></li>
      {meeting.wardBusiness.map((item) => <li key={item.description}><span>Ward business</span><strong>{item.description}</strong></li>)}
      {meeting.stakeBusiness && <li><span>Stake business</span><strong>Presented by stake leaders</strong></li>}
      <li><span>Sacrament hymn</span><strong><HymnText hymn={meeting.sacramentHymn} /></strong></li>
      {meeting.speakers.map((item, index) => <li key={`${item.name}-${index}`}><span>{item.type === "musical-number" ? "Musical number" : "Speaker"}</span><strong>{item.name}<small>{item.topic}</small></strong></li>)}
      <li><span>Closing hymn</span><strong><HymnText hymn={meeting.closingHymn} /></strong></li><li><span>Benediction</span><strong>{meeting.closingPrayer}</strong></li>
    </ol></section><aside className="announcements" aria-labelledby="announcements-heading"><h2 id="announcements-heading">Announcements</h2>{meeting.announcements.length ? <ul>{meeting.announcements.map((item) => <li key={item}>{item}</li>)}</ul> : <p>No announcements this week.</p>}<div className="quiet-note"><span aria-hidden="true">✦</span><p>Please help preserve the reverence of the chapel before the meeting begins.</p></div></aside></div>
  </article>;
}
