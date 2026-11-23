import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/components/LoginForm";
import { normalizeAuthRedirect } from "@/lib/auth-redirect";

export const metadata: Metadata = {
  title: "Bishopric sign in",
  description:
    "Sign in to manage Meadowbrook Ward sacrament meeting schedules and programs.",
};

export const instant = false;

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const params = await searchParams;
  const callbackUrl = normalizeAuthRedirect(params.callbackUrl);

  return (
    <main className="login-page shell">
      <section className="login-card" aria-labelledby="login-title">
        <p className="eyebrow">Leader access</p>
        <h1 id="login-title">Bishopric sign in</h1>
        <p className="login-copy">
          Sign in to create, update, or remove sacrament meeting programs.
        </p>
        <LoginForm callbackUrl={callbackUrl} />
        <Link className="login-back-link" href="/meetings">
          Return to the public meeting archive
        </Link>
      </section>
    </main>
  );
}
