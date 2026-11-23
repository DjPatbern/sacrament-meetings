"use server";

import { AuthError } from "next-auth";
import { signIn } from "@/auth";
import { normalizeAuthRedirect } from "@/lib/auth-redirect";

export async function authenticate(
  _previousState: string | undefined,
  formData: FormData,
): Promise<string | undefined> {
  const redirectTo = normalizeAuthRedirect(formData.get("callbackUrl"));

  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return error.type === "CredentialsSignin"
        ? "The email or password is incorrect."
        : "We could not sign you in. Please try again.";
    }

    throw error;
  }
}
