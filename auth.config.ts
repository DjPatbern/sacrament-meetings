import type { NextAuthConfig } from "next-auth";

const protectedMeetingRoute = /^\/meetings\/(?:new|[^/]+\/edit)(?:\/|$)/;

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = Boolean(auth?.user);

      if (protectedMeetingRoute.test(nextUrl.pathname)) {
        return isLoggedIn;
      }

      if (isLoggedIn && nextUrl.pathname === "/login") {
        return Response.redirect(new URL("/meetings", nextUrl));
      }

      return true;
    },
  },
  providers: [],
  trustHost: true,
} satisfies NextAuthConfig;
