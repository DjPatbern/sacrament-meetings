import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="admin-section">
      <div className="admin-bar">
        <div className="shell admin-bar-inner">
          <strong>Leader tools</strong>
          <Link href="/meetings">Return to meeting archive</Link>
        </div>
      </div>
      {children}
    </section>
  );
}
