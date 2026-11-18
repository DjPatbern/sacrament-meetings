"use client";

import Link from "next/link";
import { useActionState } from "react";
import type { MeetingFormState } from "@/lib/actions";
import type { SacramentMeeting } from "@/lib/types";

type MeetingFormAction = (
  state: MeetingFormState,
  formData: FormData,
) => Promise<MeetingFormState>;

const initialState: MeetingFormState = { message: "", revision: 0 };

function FieldErrors({
  field,
  state,
}: {
  field: string;
  state: MeetingFormState;
}) {
  const errors =
    state.errors?.[field as keyof NonNullable<typeof state.errors>];

  return (
    <div id={`${field}-error`} className="field-errors" aria-live="polite">
      {errors?.map((error) => (
        <p key={error}>{error}</p>
      ))}
    </div>
  );
}

export function MeetingForm({
  action,
  meeting,
  submitLabel,
}: {
  action: MeetingFormAction;
  meeting?: SacramentMeeting;
  submitLabel: string;
}) {
  const [state, formAction, isPending] = useActionState(action, initialState);
  const hasError = (field: string) =>
    Boolean(
      state.errors?.[field as keyof NonNullable<typeof state.errors>]?.length,
    );
  const values = state.values;
  const announcements =
    values?.announcements ?? meeting?.announcements.join("\n") ?? "";
  const wardBusiness =
    values?.wardBusiness ??
    meeting?.wardBusiness.map((item) => item.description).join("\n") ??
    "";
  const speakers =
    values?.speakers ??
    meeting?.speakers
      .map((item) => `${item.name} | ${item.topic} | ${item.type}`)
      .join("\n") ??
    "";

  return (
    <form
      key={state.revision}
      action={formAction}
      className="meeting-form"
      noValidate
    >
      <div className="form-section-heading">
        <p className="eyebrow">Meeting information</p>
        <h2>Sunday and leadership</h2>
      </div>

      <div className="form-grid form-grid-two">
        <div className="form-field">
          <label htmlFor="date">Meeting date</label>
          <input
            id="date"
            name="date"
            type="date"
            required
            defaultValue={values?.date ?? meeting?.date}
            aria-describedby="date-error"
            aria-invalid={hasError("date")}
          />
          <FieldErrors field="date" state={state} />
        </div>

        <div className="form-field">
          <label htmlFor="meetingType">Meeting type</label>
          <select
            id="meetingType"
            name="meetingType"
            required
            defaultValue={
              values?.meetingType ?? meeting?.meetingType ?? "regular"
            }
            aria-describedby="meetingType-error"
            aria-invalid={hasError("meetingType")}
          >
            <option value="regular">Regular</option>
            <option value="testimony">Fast and testimony</option>
            <option value="stake">Stake conference</option>
            <option value="general">General conference</option>
          </select>
          <FieldErrors field="meetingType" state={state} />
        </div>

        <div className="form-field">
          <label htmlFor="presiding">Presiding leader</label>
          <input
            id="presiding"
            name="presiding"
            type="text"
            required
            defaultValue={values?.presiding ?? meeting?.presiding}
            aria-describedby="presiding-error"
            aria-invalid={hasError("presiding")}
          />
          <FieldErrors field="presiding" state={state} />
        </div>

        <div className="form-field">
          <label htmlFor="conducting">Conducting leader</label>
          <input
            id="conducting"
            name="conducting"
            type="text"
            required
            defaultValue={values?.conducting ?? meeting?.conducting}
            aria-describedby="conducting-error"
            aria-invalid={hasError("conducting")}
          />
          <FieldErrors field="conducting" state={state} />
        </div>
      </div>

      <fieldset className="form-section">
        <legend>Opening</legend>
        <div className="form-grid form-grid-two">
          <div className="form-field form-field-number">
            <label htmlFor="openingHymnNumber">Opening hymn number</label>
            <input
              id="openingHymnNumber"
              name="openingHymnNumber"
              type="number"
              min="1"
              required
              defaultValue={
                values?.openingHymnNumber ?? meeting?.openingHymn.number
              }
              aria-describedby="openingHymnNumber-error"
              aria-invalid={hasError("openingHymnNumber")}
            />
            <FieldErrors field="openingHymnNumber" state={state} />
          </div>
          <div className="form-field">
            <label htmlFor="openingHymnTitle">Opening hymn title</label>
            <input
              id="openingHymnTitle"
              name="openingHymnTitle"
              type="text"
              required
              defaultValue={
                values?.openingHymnTitle ?? meeting?.openingHymn.title
              }
              aria-describedby="openingHymnTitle-error"
              aria-invalid={hasError("openingHymnTitle")}
            />
            <FieldErrors field="openingHymnTitle" state={state} />
          </div>
          <div className="form-field form-grid-span">
            <label htmlFor="openingPrayer">Opening prayer</label>
            <input
              id="openingPrayer"
              name="openingPrayer"
              type="text"
              required
              defaultValue={values?.openingPrayer ?? meeting?.openingPrayer}
              aria-describedby="openingPrayer-error"
              aria-invalid={hasError("openingPrayer")}
            />
            <FieldErrors field="openingPrayer" state={state} />
          </div>
        </div>
      </fieldset>

      <fieldset className="form-section">
        <legend>Sacrament and business</legend>
        <div className="form-grid form-grid-two">
          <div className="form-field form-field-number">
            <label htmlFor="sacramentHymnNumber">Sacrament hymn number</label>
            <input
              id="sacramentHymnNumber"
              name="sacramentHymnNumber"
              type="number"
              min="1"
              required
              defaultValue={
                values?.sacramentHymnNumber ?? meeting?.sacramentHymn.number
              }
              aria-describedby="sacramentHymnNumber-error"
              aria-invalid={hasError("sacramentHymnNumber")}
            />
            <FieldErrors field="sacramentHymnNumber" state={state} />
          </div>
          <div className="form-field">
            <label htmlFor="sacramentHymnTitle">Sacrament hymn title</label>
            <input
              id="sacramentHymnTitle"
              name="sacramentHymnTitle"
              type="text"
              required
              defaultValue={
                values?.sacramentHymnTitle ?? meeting?.sacramentHymn.title
              }
              aria-describedby="sacramentHymnTitle-error"
              aria-invalid={hasError("sacramentHymnTitle")}
            />
            <FieldErrors field="sacramentHymnTitle" state={state} />
          </div>
          <div className="form-field">
            <label htmlFor="announcements">Announcements</label>
            <textarea
              id="announcements"
              name="announcements"
              rows={5}
              defaultValue={announcements}
              aria-describedby="announcements-help announcements-error"
              aria-invalid={hasError("announcements")}
            />
            <p id="announcements-help" className="field-help">
              Enter one announcement per line.
            </p>
            <FieldErrors field="announcements" state={state} />
          </div>
          <div className="form-field">
            <label htmlFor="wardBusiness">Ward business</label>
            <textarea
              id="wardBusiness"
              name="wardBusiness"
              rows={5}
              defaultValue={wardBusiness}
              aria-describedby="wardBusiness-help wardBusiness-error"
              aria-invalid={hasError("wardBusiness")}
            />
            <p id="wardBusiness-help" className="field-help">
              Enter one item per line.
            </p>
            <FieldErrors field="wardBusiness" state={state} />
          </div>
          <div className="form-field form-grid-span checkbox-field">
            <input
              id="stakeBusiness"
              name="stakeBusiness"
              type="checkbox"
              defaultChecked={
                values?.stakeBusiness ?? meeting?.stakeBusiness ?? false
              }
              aria-describedby="stakeBusiness-error"
              aria-invalid={hasError("stakeBusiness")}
            />
            <label htmlFor="stakeBusiness">
              This meeting includes stake business
            </label>
            <FieldErrors field="stakeBusiness" state={state} />
          </div>
        </div>
      </fieldset>

      <fieldset className="form-section">
        <legend>Speakers and musical numbers</legend>
        <div className="form-field">
          <label htmlFor="speakers">Program participants</label>
          <textarea
            id="speakers"
            name="speakers"
            rows={7}
            required
            defaultValue={speakers}
            aria-describedby="speakers-help speakers-error"
            aria-invalid={hasError("speakers")}
          />
          <p id="speakers-help" className="field-help">
            One per line: Name | Topic or title | speaker or musical-number
          </p>
          <FieldErrors field="speakers" state={state} />
        </div>
      </fieldset>

      <fieldset className="form-section">
        <legend>Closing</legend>
        <div className="form-grid form-grid-two">
          <div className="form-field form-field-number">
            <label htmlFor="closingHymnNumber">Closing hymn number</label>
            <input
              id="closingHymnNumber"
              name="closingHymnNumber"
              type="number"
              min="1"
              required
              defaultValue={
                values?.closingHymnNumber ?? meeting?.closingHymn.number
              }
              aria-describedby="closingHymnNumber-error"
              aria-invalid={hasError("closingHymnNumber")}
            />
            <FieldErrors field="closingHymnNumber" state={state} />
          </div>
          <div className="form-field">
            <label htmlFor="closingHymnTitle">Closing hymn title</label>
            <input
              id="closingHymnTitle"
              name="closingHymnTitle"
              type="text"
              required
              defaultValue={
                values?.closingHymnTitle ?? meeting?.closingHymn.title
              }
              aria-describedby="closingHymnTitle-error"
              aria-invalid={hasError("closingHymnTitle")}
            />
            <FieldErrors field="closingHymnTitle" state={state} />
          </div>
          <div className="form-field form-grid-span">
            <label htmlFor="closingPrayer">Closing prayer</label>
            <input
              id="closingPrayer"
              name="closingPrayer"
              type="text"
              required
              defaultValue={values?.closingPrayer ?? meeting?.closingPrayer}
              aria-describedby="closingPrayer-error"
              aria-invalid={hasError("closingPrayer")}
            />
            <FieldErrors field="closingPrayer" state={state} />
          </div>
        </div>
      </fieldset>

      <div className="form-status" aria-live="polite">
        {state.message}
      </div>
      <div className="form-actions">
        <button
          className="button button-primary"
          type="submit"
          disabled={isPending}
        >
          {isPending ? "Saving…" : submitLabel}
        </button>
        <Link className="button button-secondary" href="/meetings">
          Cancel
        </Link>
      </div>
    </form>
  );
}
