"use client";

import { useActionState } from "react";
import { authenticate } from "@/lib/auth-actions";

export function LoginForm({ callbackUrl }: { callbackUrl: string }) {
  const [errorMessage, formAction, isPending] = useActionState(
    authenticate,
    undefined,
  );

  return (
    <form action={formAction} className="login-form">
      <input type="hidden" name="callbackUrl" value={callbackUrl} />
      <div className="form-field">
        <label htmlFor="email">Email address</label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
        />
      </div>
      <div className="form-field">
        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          minLength={8}
          required
          aria-describedby={errorMessage ? "login-error" : undefined}
          aria-invalid={Boolean(errorMessage)}
        />
      </div>
      {errorMessage && (
        <p id="login-error" className="login-error" role="alert">
          {errorMessage}
        </p>
      )}
      <button
        className="button button-primary login-submit"
        type="submit"
        disabled={isPending}
        aria-disabled={isPending}
      >
        {isPending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
