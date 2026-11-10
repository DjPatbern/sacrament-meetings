import "server-only";

import { neon } from "@neondatabase/serverless";
import type {
  MeetingType,
  SacramentMeeting,
  SpeakerItem,
  WardBusinessItem,
} from "./types";

const MEETINGS_PER_PAGE = 3;

type MeetingRow = Omit<
  SacramentMeeting,
  "announcements" | "wardBusiness" | "stakeBusiness" | "speakers"
> & {
  announcements: string[] | null;
  wardBusiness: WardBusinessItem[] | null;
  stakeBusiness: boolean | null;
  speakers: SpeakerItem[] | null;
};

type CountRow = { count: number | string };

let sqlClient: ReturnType<typeof neon> | null = null;

function getSql(): ReturnType<typeof neon> {
  if (sqlClient) return sqlClient;

  const connectionString = process.env.DATABASE_URL ?? process.env.POSTGRES_URL;

  if (!connectionString) {
    throw new Error(
      "Missing DATABASE_URL or POSTGRES_URL for the Vercel Postgres database.",
    );
  }

  sqlClient = neon(connectionString);
  return sqlClient;
}

function normalizeMeeting(row: MeetingRow): SacramentMeeting {
  return {
    ...row,
    meetingType: row.meetingType as MeetingType,
    announcements: row.announcements ?? [],
    wardBusiness: row.wardBusiness ?? [],
    stakeBusiness: row.stakeBusiness ?? false,
    speakers: row.speakers ?? [],
  };
}

function isIsoDate(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

/**
 * With no page argument, the first value is the optional API date filter.
 * With a page argument, the first value is the meetings-list search query.
 */
export async function getMeetings(
  queryOrDate: string | null = "",
  currentPage?: number,
): Promise<SacramentMeeting[]> {
  const sql = getSql();

  if (currentPage === undefined) {
    if (queryOrDate && !isIsoDate(queryOrDate)) return [];

    const rows = queryOrDate
      ? await sql`
          SELECT
            id,
            TO_CHAR(date, 'YYYY-MM-DD') AS date,
            meeting_type AS "meetingType",
            presiding,
            conducting,
            announcements,
            opening_hymn AS "openingHymn",
            opening_prayer AS "openingPrayer",
            ward_business AS "wardBusiness",
            stake_business AS "stakeBusiness",
            sacrament_hymn AS "sacramentHymn",
            speakers,
            closing_hymn AS "closingHymn",
            closing_prayer AS "closingPrayer"
          FROM meetings
          WHERE date = ${queryOrDate}
          ORDER BY date DESC
        `
      : await sql`
          SELECT
            id,
            TO_CHAR(date, 'YYYY-MM-DD') AS date,
            meeting_type AS "meetingType",
            presiding,
            conducting,
            announcements,
            opening_hymn AS "openingHymn",
            opening_prayer AS "openingPrayer",
            ward_business AS "wardBusiness",
            stake_business AS "stakeBusiness",
            sacrament_hymn AS "sacramentHymn",
            speakers,
            closing_hymn AS "closingHymn",
            closing_prayer AS "closingPrayer"
          FROM meetings
          ORDER BY date DESC
        `;

    return (rows as MeetingRow[]).map(normalizeMeeting);
  }

  const page = Math.max(1, Math.floor(currentPage));
  const offset = (page - 1) * MEETINGS_PER_PAGE;
  const pattern = `%${queryOrDate?.trim() ?? ""}%`;
  const rows = await sql`
    SELECT
      id,
      TO_CHAR(date, 'YYYY-MM-DD') AS date,
      meeting_type AS "meetingType",
      presiding,
      conducting,
      announcements,
      opening_hymn AS "openingHymn",
      opening_prayer AS "openingPrayer",
      ward_business AS "wardBusiness",
      stake_business AS "stakeBusiness",
      sacrament_hymn AS "sacramentHymn",
      speakers,
      closing_hymn AS "closingHymn",
      closing_prayer AS "closingPrayer"
    FROM meetings
    WHERE
      meeting_type ILIKE ${pattern}
      OR presiding ILIKE ${pattern}
      OR conducting ILIKE ${pattern}
      OR opening_prayer ILIKE ${pattern}
      OR closing_prayer ILIKE ${pattern}
      OR COALESCE(array_to_string(announcements, ' '), '') ILIKE ${pattern}
      OR COALESCE(speakers::text, '') ILIKE ${pattern}
    ORDER BY date DESC
    LIMIT ${MEETINGS_PER_PAGE}
    OFFSET ${offset}
  `;

  return (rows as MeetingRow[]).map(normalizeMeeting);
}

export async function getMeetingsTotalPages(query = ""): Promise<number> {
  const sql = getSql();
  const pattern = `%${query.trim()}%`;
  const rows = await sql`
    SELECT COUNT(*) AS count
    FROM meetings
    WHERE
      meeting_type ILIKE ${pattern}
      OR presiding ILIKE ${pattern}
      OR conducting ILIKE ${pattern}
      OR opening_prayer ILIKE ${pattern}
      OR closing_prayer ILIKE ${pattern}
      OR COALESCE(array_to_string(announcements, ' '), '') ILIKE ${pattern}
      OR COALESCE(speakers::text, '') ILIKE ${pattern}
  `;
  const count = Number((rows as CountRow[])[0]?.count ?? 0);

  return Math.max(1, Math.ceil(count / MEETINGS_PER_PAGE));
}

export async function getMeetingById(
  id: number,
): Promise<SacramentMeeting | null> {
  const sql = getSql();
  const rows = await sql`
    SELECT
      id,
      TO_CHAR(date, 'YYYY-MM-DD') AS date,
      meeting_type AS "meetingType",
      presiding,
      conducting,
      announcements,
      opening_hymn AS "openingHymn",
      opening_prayer AS "openingPrayer",
      ward_business AS "wardBusiness",
      stake_business AS "stakeBusiness",
      sacrament_hymn AS "sacramentHymn",
      speakers,
      closing_hymn AS "closingHymn",
      closing_prayer AS "closingPrayer"
    FROM meetings
    WHERE id = ${id}
    LIMIT 1
  `;
  const meeting = (rows as MeetingRow[])[0];

  return meeting ? normalizeMeeting(meeting) : null;
}

function getLagosDate(today: Date): Date {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Africa/Lagos",
    year: "numeric",
    month: "numeric",
    day: "numeric",
  }).formatToParts(today);
  const value = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((part) => part.type === type)?.value);

  return new Date(
    Date.UTC(value("year"), value("month") - 1, value("day"), 12),
  );
}

export async function getCurrentSundayMeeting(
  today = new Date(),
): Promise<SacramentMeeting> {
  const sql = getSql();
  const sunday = getLagosDate(today);
  sunday.setUTCDate(sunday.getUTCDate() + ((7 - sunday.getUTCDay()) % 7));
  const sundayKey = sunday.toISOString().slice(0, 10);
  const rows = await sql`
    SELECT
      id,
      TO_CHAR(date, 'YYYY-MM-DD') AS date,
      meeting_type AS "meetingType",
      presiding,
      conducting,
      announcements,
      opening_hymn AS "openingHymn",
      opening_prayer AS "openingPrayer",
      ward_business AS "wardBusiness",
      stake_business AS "stakeBusiness",
      sacrament_hymn AS "sacramentHymn",
      speakers,
      closing_hymn AS "closingHymn",
      closing_prayer AS "closingPrayer"
    FROM meetings
    ORDER BY
      CASE
        WHEN date = ${sundayKey} THEN 0
        WHEN date < ${sundayKey} THEN 1
        ELSE 2
      END,
      CASE WHEN date <= ${sundayKey} THEN date END DESC,
      CASE WHEN date > ${sundayKey} THEN date END ASC
    LIMIT 1
  `;
  const meeting = (rows as MeetingRow[])[0];

  if (!meeting) {
    throw new Error("No sacrament meetings are available in the database.");
  }

  return normalizeMeeting(meeting);
}
