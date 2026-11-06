import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return <main>
    <section className="hero shell" aria-labelledby="hero-title">
      <div className="hero-copy">
        <p className="eyebrow">Sunday worship, thoughtfully prepared</p>
        <h1 id="hero-title">Every sacrament meeting, in one peaceful place.</h1>
        <p className="hero-text">Review upcoming programs, revisit past Sundays, and keep every part of the meeting easy to find.</p>
        <div className="hero-actions">
          <Link className="button button-primary" href="/meetings/current">View this Sunday</Link>
          <Link className="button button-secondary" href="/meetings">Browse all meetings</Link>
        </div>
      </div>
      <div className="hero-art" aria-hidden="true"><Image src="/globe.svg" alt="" width={420} height={420} priority /></div>
    </section>
    <section className="feature-section shell" aria-labelledby="features-title">
      <div className="section-heading"><p className="eyebrow">Made for the whole ward</p><h2 id="features-title">A clear program from welcome to benediction.</h2></div>
      <div className="feature-grid">
        <article className="feature-card"><span className="feature-number">01</span><h3>Prepare</h3><p>See hymns, prayers, announcements, and speakers at a glance.</p></article>
        <article className="feature-card"><span className="feature-number">02</span><h3>Navigate</h3><p>Move naturally between this Sunday and the complete archive.</p></article>
        <article className="feature-card"><span className="feature-number">03</span><h3>Print</h3><p>Open a calm, print-ready program for current or past meetings.</p></article>
      </div>
    </section>
  </main>;
}
