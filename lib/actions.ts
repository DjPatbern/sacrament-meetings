"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
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
  stakeBusiness: z.preprocess(
    (value) => value === "on" || value === "true",
    z.boolean(),
  ),
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

export type MeetingFormState = {
  message: string;
  errors?: Partial<Record<keyof MeetingFormFields, string[]>>;
};

function readFormData(
  formData: FormData,
): Record<keyof MeetingFormFields, FormDataEntryValue | null> {
  return {
    date: formData.get("date"),
    meetingType: formData.get("meetingType"),
    presiding: formData.get("presiding"),
    conducting: formData.get("conducting"),
    announcements: formData.get("announcements"),
    openingHymnNumber: formData.get("openingHymnNumber"),
    openingHymnTitle: formData.get("openingHymnTitle"),
    openingPrayer: formData.get("openingPrayer"),
    wardBusiness: formData.get("wardBusiness"),
    stakeBusiness: formData.get("stakeBusiness"),
    sacramentHymnNumber: formData.get("sacramentHymnNumber"),
    sacramentHymnTitle: formData.get("sacramentHymnTitle"),
    speakers: formData.get("speakers"),
    closingHymnNumber: formData.get("closingHymnNumber"),
    closingHymnTitle: formData.get("closingHymnTitle"),
    closingPrayer: formData.get("closingPrayer"),
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

function validateMeeting(formData: FormData) {
  return MeetingFormSchema.safeParse(readFormData(formData));
}

export async function createMeeting(
  _previousState: MeetingFormState,
  formData: FormData,
): Promise<MeetingFormState> {
  const validated = validateMeeting(formData);

  if (!validated.success) {
    return {
      message: "Please correct the highlighted fields.",
      errors: validated.error.flatten().fieldErrors,
    };
  }

  try {
    await createMeetingRecord(toMeetingInput(validated.data));
  } catch (error) {
    console.error("Unable to create meeting:", error);
    throw new Error(
      "We could not create the meeting. Check that the date is not already in use and try again.",
    );
  }

  revalidatePath("/meetings");
  redirect("/meetings");
}

export async function updateMeeting(
  id: number,
  _previousState: MeetingFormState,
  formData: FormData,
): Promise<MeetingFormState> {
  const validated = validateMeeting(formData);

  if (!validated.success) {
    return {
      message: "Please correct the highlighted fields.",
      errors: validated.error.flatten().fieldErrors,
    };
  }

  try {
    const updated = await updateMeetingRecord(
      id,
      toMeetingInput(validated.data),
    );
    if (!updated) throw new Error(`Meeting ${id} was not found.`);
  } catch (error) {
    console.error(`Unable to update meeting ${id}:`, error);
    throw new Error(
      "We could not update the meeting. Check that the date is not already in use and try again.",
    );
  }

  revalidatePath("/meetings");
  revalidatePath(`/meetings/${id}`);
  redirect("/meetings");
}

export async function deleteMeeting(id: number): Promise<void> {
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
