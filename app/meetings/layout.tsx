import Link from "next/link";
export default function MeetingsLayout({ children }: { children: React.ReactNode }) { return <div className="meetings-section"><div className="section-bar"><div className="shell section-bar-inner"><Link href="/meetings">Meeting archive</Link><Link href="/meetings/current">Go to this Sunday <span aria-hidden="true">→</span></Link></div></div>{children}</div>; }
