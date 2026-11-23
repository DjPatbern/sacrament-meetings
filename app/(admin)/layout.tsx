import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { SignOutButton } from "@/components/SignOutButton";

export const instant = false;

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <section className="admin-section">
      <div className="admin-bar">
        <div className="shell admin-bar-inner">
          <strong>Leader tools</strong>
          <div className="admin-bar-actions">
            <span>{session.user.email}</span>
            <Link href="/meetings">Meeting archive</Link>
            <SignOutButton />
          </div>
        </div>
      </div>
      {children}
    </section>
  );
}
