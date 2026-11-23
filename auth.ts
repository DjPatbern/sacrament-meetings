import "server-only";

import { compare } from "bcryptjs";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import { authConfig } from "./auth.config";

const credentialsSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(8),
});

export const { auth, handlers, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsed = credentialsSchema.safeParse(credentials);
        const ownerEmail = process.env.AUTH_EMAIL?.trim().toLowerCase();
        const passwordHash = process.env.AUTH_PASSWORD_HASH;

        if (!parsed.success || !ownerEmail || !passwordHash) return null;

        const email = parsed.data.email.toLowerCase();
        if (email !== ownerEmail) return null;

        const passwordsMatch = await compare(
          parsed.data.password,
          passwordHash,
        );
        if (!passwordsMatch) return null;

        return {
          id: "bishopric",
          email: ownerEmail,
          name: "Meadowbrook Ward Bishopric",
        };
      },
    }),
  ],
});
