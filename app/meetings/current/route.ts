import { getCurrentSundayMeeting } from "@/lib/meetings-db";

export function GET(request: Request): Response {
  const meeting = getCurrentSundayMeeting();
  return Response.redirect(new URL(`/meetings/${meeting.id}`, request.url), 307);
}
