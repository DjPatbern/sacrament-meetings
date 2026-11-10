import { redirect } from "next/navigation";
import { connection } from "next/server";
import { getCurrentSundayMeeting } from "@/lib/meetings-db";

export const instant = false;

export default async function CurrentMeetingPage() {
  await connection();
  const meeting = await getCurrentSundayMeeting();
  redirect(`/meetings/${meeting.id}`);
}
