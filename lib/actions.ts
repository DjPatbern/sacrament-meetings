"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { auth } from "@/auth";
import {
  createMeeting as createMeetingRecord,
  deleteMeeting as deleteMeetingRecord,
  updateMeeting as updateMeetingRecord,
} from "./meetings-db";
import type { MeetingInput, SpeakerItem } from "./types";

const requiredText = (label: string) =>
  z.string().trim().min(2, `${label} must be at least 2 characters.`);

const lineList = z.string().transform((value) =>
  value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean),
);

const speakersSchema = z
  .string()
  .trim()
  .min(1, "Add at least one speaker or musical number.")
  .transform((value, context): SpeakerItem[] => {
    const lines = value
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
    const speakers: SpeakerItem[] = [];

    for (const [index, line] of lines.entries()) {
      const [name, topic, type] = line.split("|").map((item) => item.trim());

      if (
        !name ||
        !topic ||
        (type !== "speaker" && type !== "musical-number")
      ) {
        context.addIssue({
          code: "custom",
          message: `Line ${index + 1} must use: Name | Topic | speaker or musical-number.`,
        });
        continue;
      }

      speakers.push({ name, topic, type });
    }

    return speakers;
  });

const sundayDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Enter a valid meeting date.")
  .refine((value) => {
    const date = new Date(`${value}T12:00:00Z`);
    return (
      !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value
    );
  }, "Enter a real calendar date.")
  .refine(
    (value) => new Date(`${value}T12:00:00Z`).getUTCDay() === 0,
    "Sacrament meetings must be scheduled on a Sunday.",
  );

const MeetingFormSchema = z.object({
  date: sundayDate,
  meetingType: z.enum(["testimony", "regular", "stake", "general"]),
  presiding: requiredText("Presiding leader"),
  conducting: requiredText("Conducting leader"),
  announcements: lineList,
  openingHymnNumber: z.coerce
    .number()
    .int("Use a whole hymn number.")
    .positive("Opening hymn number is required."),
  openingHymnTitle: requiredText("Opening hymn title"),
  openingPrayer: requiredText("Opening prayer"),
  wardBusiness: lineList.transform((items) =>
    items.map((description) => ({ description })),
  ),
  stakeBusiness: z.boolean(),
  sacramentHymnNumber: z.coerce
    .number()
    .int("Use a whole hymn number.")
    .positive("Sacrament hymn number is required."),
  sacramentHymnTitle: requiredText("Sacrament hymn title"),
  speakers: speakersSchema,
  closingHymnNumber: z.coerce
    .number()
    .int("Use a whole hymn number.")
    .positive("Closing hymn number is required."),
  closingHymnTitle: requiredText("Closing hymn title"),
  closingPrayer: requiredText("Closing prayer"),
});

type MeetingFormFields = z.input<typeof MeetingFormSchema>;

export type MeetingFormValues = {
  [Field in keyof MeetingFormFields]: Field extends "stakeBusiness"
    ? boolean
    : string;
};

export type MeetingFormState = {
  message: string;
  revision: number;
  errors?: Partial<Record<keyof MeetingFormFields, string[]>>;
  values?: MeetingFormValues;
};

function readFormData(formData: FormData): MeetingFormValues {
  const text = (field: keyof MeetingFormFields) => {
    const value = formData.get(field);
    return typeof value === "string" ? value : "";
  };

  return {
    date: text("date"),
    meetingType: text("meetingType"),
    presiding: text("presiding"),
    conducting: text("conducting"),
    announcements: text("announcements"),
    openingHymnNumber: text("openingHymnNumber"),
    openingHymnTitle: text("openingHymnTitle"),
    openingPrayer: text("openingPrayer"),
    wardBusiness: text("wardBusiness"),
    stakeBusiness: formData.get("stakeBusiness") !== null,
    sacramentHymnNumber: text("sacramentHymnNumber"),
    sacramentHymnTitle: text("sacramentHymnTitle"),
    speakers: text("speakers"),
    closingHymnNumber: text("closingHymnNumber"),
    closingHymnTitle: text("closingHymnTitle"),
    closingPrayer: text("closingPrayer"),
  };
}

function toMeetingInput(
  meeting: z.output<typeof MeetingFormSchema>,
): MeetingInput {
  return {
    date: meeting.date,
    meetingType: meeting.meetingType,
    presiding: meeting.presiding,
    conducting: meeting.conducting,
    announcements: meeting.announcements,
    openingHymn: {
      number: meeting.openingHymnNumber,
      title: meeting.openingHymnTitle,
    },
    openingPrayer: meeting.openingPrayer,
    wardBusiness: meeting.wardBusiness,
    stakeBusiness: meeting.stakeBusiness,
    sacramentHymn: {
      number: meeting.sacramentHymnNumber,
      title: meeting.sacramentHymnTitle,
    },
    speakers: meeting.speakers,
    closingHymn: {
      number: meeting.closingHymnNumber,
      title: meeting.closingHymnTitle,
    },
    closingPrayer: meeting.closingPrayer,
  };
}

function isUniqueConstraintError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "23505"
  );
}

async function requireBishopricSession(): Promise<void> {
  const session = await auth();
  if (!session?.user) redirect("/login");
}

export async function createMeeting(
  previousState: MeetingFormState,
  formData: FormData,
): Promise<MeetingFormState> {
  await requireBishopricSession();
  const values = readFormData(formData);
  const validated = MeetingFormSchema.safeParse(values);

  if (!validated.success) {
    return {
      message: "Please correct the highlighted fields.",
      revision: previousState.revision + 1,
      errors: validated.error.flatten().fieldErrors,
      values,
    };
  }

  try {
    await createMeetingRecord(toMeetingInput(validated.data));
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return {
        message: "Choose a different Sunday before saving.",
        revision: previousState.revision + 1,
        errors: { date: ["A meeting already exists for this date."] },
        values,
      };
    }
    console.error("Unable to create meeting:", error);
    return {
      message: "We could not create the meeting. Please try again.",
      revision: previousState.revision + 1,
      values,
    };
  }

  revalidatePath("/meetings");
  redirect("/meetings");
}

export async function updateMeeting(
  id: number,
  previousState: MeetingFormState,
  formData: FormData,
): Promise<MeetingFormState> {
  await requireBishopricSession();
  const values = readFormData(formData);
  const validated = MeetingFormSchema.safeParse(values);

  if (!validated.success) {
    return {
      message: "Please correct the highlighted fields.",
      revision: previousState.revision + 1,
      errors: validated.error.flatten().fieldErrors,
      values,
    };
  }

  try {
    const updated = await updateMeetingRecord(
      id,
      toMeetingInput(validated.data),
    );
    if (!updated) throw new Error(`Meeting ${id} was not found.`);
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return {
        message: "Choose a different Sunday before saving.",
        revision: previousState.revision + 1,
        errors: { date: ["A meeting already exists for this date."] },
        values,
      };
    }
    console.error(`Unable to update meeting ${id}:`, error);
    return {
      message: "We could not update the meeting. Please try again.",
      revision: previousState.revision + 1,
      values,
    };
  }

  revalidatePath("/meetings");
  revalidatePath(`/meetings/${id}`);
  redirect("/meetings");
}

export async function deleteMeeting(id: number): Promise<void> {
  await requireBishopricSession();
  try {
    const deleted = await deleteMeetingRecord(id);
    if (!deleted) throw new Error(`Meeting ${id} was not found.`);
  } catch (error) {
    console.error(`Unable to delete meeting ${id}:`, error);
    throw new Error("We could not delete the meeting. Please try again.");
  }

  revalidatePath("/meetings");
  redirect("/meetings");
}
