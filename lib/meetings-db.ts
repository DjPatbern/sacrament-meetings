import type { SacramentMeeting } from "./types";

const meetings: SacramentMeeting[] = [
  {
    id: 1,
    date: "2026-05-03",
    meetingType: "regular",
    presiding: "Bishop Andrew Smith",
    conducting: "Brother Marcus Jones",
    announcements: [
      "Ward temple night: May 10",
      "Youth service project: May 16",
    ],
    openingHymn: { number: 2, title: "The Spirit of God" },
    openingPrayer: "Sister Ruth Williams",
    wardBusiness: [{ description: "Sustaining of the new Primary presidency" }],
    stakeBusiness: false,
    sacramentHymn: { number: 169, title: "As Now We Take the Sacrament" },
    speakers: [
      {
        name: "Sister Naomi Brown",
        topic: "Faith in Jesus Christ",
        type: "speaker",
      },
      {
        name: "Meadowbrook Youth Choir",
        topic: "I Know That My Redeemer Lives",
        type: "musical-number",
      },
      {
        name: "Brother Caleb Martin",
        topic: "Covenants bring us closer to Christ",
        type: "speaker",
      },
    ],
    closingHymn: { number: 31, title: "O God, Our Help in Ages Past" },
    closingPrayer: "Brother David Ellis",
  },
  {
    id: 2,
    date: "2026-05-10",
    meetingType: "testimony",
    presiding: "Bishop Andrew Smith",
    conducting: "Brother Samuel Reed",
    announcements: ["Relief Society activity: May 14"],
    openingHymn: { number: 136, title: "I Know That My Redeemer Lives" },
    openingPrayer: "Sister Grace Okafor",
    wardBusiness: [],
    stakeBusiness: false,
    sacramentHymn: { number: 174, title: "While of These Emblems We Partake" },
    speakers: [{ name: "Ward members", topic: "Testimonies", type: "speaker" }],
    closingHymn: { number: 134, title: "I Believe in Christ" },
    closingPrayer: "Brother Peter Cole",
  },
  {
    id: 3,
    date: "2026-10-25",
    meetingType: "stake",
    presiding: "President Daniel Mensah",
    conducting: "President Isaac Moore",
    announcements: ["Stake conference sessions begin at 10:00 AM"],
    openingHymn: { number: 6, title: "Redeemer of Israel" },
    openingPrayer: "Sister Lydia Young",
    wardBusiness: [],
    stakeBusiness: true,
    sacramentHymn: { number: 180, title: "Father in Heaven, We Do Believe" },
    speakers: [
      {
        name: "Stake presidency",
        topic: "Becoming one in Christ",
        type: "speaker",
      },
    ],
    closingHymn: { number: 220, title: "Lord, I Would Follow Thee" },
    closingPrayer: "Brother James Adebayo",
  },
  {
    id: 4,
    date: "2026-11-01",
    meetingType: "testimony",
    presiding: "Bishop Andrew Smith",
    conducting: "Brother Marcus Jones",
    announcements: ["Tithing declaration appointments are now available"],
    openingHymn: { number: 241, title: "Count Your Blessings" },
    openingPrayer: "Sister Hannah Lewis",
    wardBusiness: [
      { description: "Release and sustaining of Sunday School teachers" },
    ],
    stakeBusiness: false,
    sacramentHymn: { number: 172, title: "In Humility, Our Savior" },
    speakers: [{ name: "Ward members", topic: "Testimonies", type: "speaker" }],
    closingHymn: { number: 301, title: "I Am a Child of God" },
    closingPrayer: "Brother Michael Chen",
  },
  {
    id: 5,
    date: "2026-11-08",
    meetingType: "regular",
    presiding: "Bishop Andrew Smith",
    conducting: "Brother Samuel Reed",
    announcements: [
      "Ward service morning: November 14",
      "Primary program rehearsal Saturday at 9:00 AM",
    ],
    openingHymn: { number: 67, title: "Glory to God on High" },
    openingPrayer: "Sister Olivia Grant",
    wardBusiness: [{ description: "Sustaining of new Young Women advisers" }],
    stakeBusiness: false,
    sacramentHymn: { number: 173, title: "While of These Emblems We Partake" },
    speakers: [
      {
        name: "Sister Amelia Brooks",
        topic: "Finding peace through prayer",
        type: "speaker",
      },
      {
        name: "Ethan and Maya Reed",
        topic: "Savior, Redeemer of My Soul",
        type: "musical-number",
      },
      {
        name: "Brother Nathan Price",
        topic: "Ministering as the Savior did",
        type: "speaker",
      },
    ],
    closingHymn: { number: 129, title: "Where Can I Turn for Peace?" },
    closingPrayer: "Brother Liam Foster",
  },
  {
    id: 6,
    date: "2026-11-15",
    meetingType: "general",
    presiding: "The First Presidency",
    conducting: "General conference broadcast",
    announcements: [
      "Watch the conference broadcast at home or at the meetinghouse",
    ],
    openingHymn: { number: 3, title: "Now Let Us Rejoice" },
    openingPrayer: "By invitation",
    wardBusiness: [],
    stakeBusiness: false,
    sacramentHymn: { number: 169, title: "As Now We Take the Sacrament" },
    speakers: [
      {
        name: "General Authorities and Officers",
        topic: "General conference",
        type: "speaker",
      },
    ],
    closingHymn: { number: 2, title: "The Spirit of God" },
    closingPrayer: "By invitation",
  },
];

export function getMeetings(date?: string | null): SacramentMeeting[] {
  const result = date ? meetings.filter((m) => m.date === date) : meetings;
  return [...result].sort((a, b) => b.date.localeCompare(a.date));
}
export function getMeetingById(id: number): SacramentMeeting | null {
  return meetings.find((m) => m.id === id) ?? null;
}
export function getCurrentSundayMeeting(today = new Date()): SacramentMeeting {
  const sunday = new Date(today);
  sunday.setHours(12, 0, 0, 0);
  sunday.setDate(today.getDate() + ((7 - today.getDay()) % 7));
  const key = sunday.toISOString().slice(0, 10);
  return (
    meetings.find((m) => m.date === key) ??
    getMeetings().find((m) => m.date <= key) ??
    getMeetings()[0]
  );
}
