import { signOut } from "@/auth";

export function SignOutButton() {
  return (
    <form
      action={async () => {
        "use server";
        await signOut({ redirectTo: "/" });
      }}
    >
      <button className="admin-sign-out" type="submit">
        Sign out
      </button>
    </form>
  );
}
