"use client";

import { useState, type FormEvent } from "react";
import { Check, LoaderCircle } from "lucide-react";

type FieldName =
  | "fullName"
  | "email"
  | "phone"
  | "organization"
  | "role"
  | "preferredDate"
  | "preferredTime";

type Errors = Partial<Record<FieldName, string>>;

const fieldClass =
  "mt-2 min-h-12 w-full rounded-[var(--radius-control)] border border-paper-line bg-white px-4 text-base text-text-dark shadow-sm outline-none transition-[border-color,box-shadow] duration-200 placeholder:text-muted-light/70 focus:border-accent focus:ring-2 focus:ring-accent/15";

function validate(form: HTMLFormElement): Errors {
  const data = new FormData(form);
  const value = (name: FieldName) => String(data.get(name) ?? "").trim();
  const errors: Errors = {};

  if (value("fullName").length < 2) errors.fullName = "Please enter your full name.";
  if (!/^\S+@\S+\.\S+$/.test(value("email"))) errors.email = "Please enter a valid email address.";
  if (!/^[+()\d][\d\s()+.-]{6,19}$/.test(value("phone"))) {
    errors.phone = "Please enter a valid phone number, including the area code.";
  }
  if (value("organization").length < 2) errors.organization = "Please enter your organization or community name.";
  if (value("role").length < 2) errors.role = "Please enter your role or position.";
  if (!value("preferredDate")) errors.preferredDate = "Please choose a preferred date.";
  if (!value("preferredTime")) errors.preferredTime = "Please choose a preferred time.";

  return errors;
}

async function submitDemoRequest(data: FormData) {
  // Replace this simulated request with a fetch to an API route or CRM/email
  // service. Keeping the transport here leaves validation and UI unchanged.
  void data;
  await new Promise((resolve) => setTimeout(resolve, 900));
}

function ErrorMessage({ name, errors }: { name: FieldName; errors: Errors }) {
  return errors[name] ? (
    <p id={`${name}-error`} className="mt-1.5 text-sm font-medium text-accent" role="alert">
      {errors[name]}
    </p>
  ) : null;
}

export function BookDemoForm() {
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const nextErrors = validate(form);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length) {
      const firstName = Object.keys(nextErrors)[0] as FieldName;
      (form.elements.namedItem(firstName) as HTMLElement | null)?.focus();
      return;
    }

    setStatus("submitting");
    await submitDemoRequest(new FormData(form));
    setStatus("success");
  }

  if (status === "success") {
    return (
      <div className="flex min-h-[32rem] flex-col items-center justify-center px-6 text-center" role="status" aria-live="polite">
        <span className="demo-success-check grid h-20 w-20 place-items-center rounded-full bg-accent text-text-light">
          <Check aria-hidden="true" size={38} strokeWidth={2} />
        </span>
        <h2 className="mt-7 text-3xl text-text-dark">You’re all set.</h2>
        <p className="mt-3 max-w-sm leading-relaxed text-muted-light">
          Thanks! We’ll contact you soon to confirm your demo.
        </p>
      </div>
    );
  }

  const field = (name: FieldName) => ({
    "aria-invalid": Boolean(errors[name]),
    "aria-describedby": errors[name] ? `${name}-error` : undefined,
  });

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-5" aria-label="Book a demo">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block text-sm font-semibold text-text-dark">
          Full Name
          <input name="fullName" autoComplete="name" placeholder="Juan Dela Cruz" className={fieldClass} {...field("fullName")} />
          <ErrorMessage name="fullName" errors={errors} />
        </label>
        <label className="block text-sm font-semibold text-text-dark">
          Email
          <input name="email" type="email" autoComplete="email" placeholder="juan@example.com" className={fieldClass} {...field("email")} />
          <ErrorMessage name="email" errors={errors} />
        </label>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block text-sm font-semibold text-text-dark">
          Phone Number
          <input name="phone" type="tel" autoComplete="tel" inputMode="tel" placeholder="+63 912 345 6789" className={fieldClass} {...field("phone")} />
          <ErrorMessage name="phone" errors={errors} />
        </label>
        <label className="block text-sm font-semibold text-text-dark">
          Organization / Community Name
          <input name="organization" autoComplete="organization" placeholder="Barangay or organization" className={fieldClass} {...field("organization")} />
          <ErrorMessage name="organization" errors={errors} />
        </label>
      </div>

      <label className="block text-sm font-semibold text-text-dark">
        Role / Position
        <input name="role" autoComplete="organization-title" placeholder="e.g. Community Administrator" className={fieldClass} {...field("role")} />
        <ErrorMessage name="role" errors={errors} />
      </label>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block text-sm font-semibold text-text-dark">
          Preferred Date
          <input name="preferredDate" type="date" className={fieldClass} {...field("preferredDate")} />
          <ErrorMessage name="preferredDate" errors={errors} />
        </label>
        <label className="block text-sm font-semibold text-text-dark">
          Preferred Time
          <input name="preferredTime" type="time" className={fieldClass} {...field("preferredTime")} />
          <ErrorMessage name="preferredTime" errors={errors} />
        </label>
      </div>

      <label className="block text-sm font-semibold text-text-dark">
        Message / Notes <span className="font-normal text-muted-light">(optional)</span>
        <textarea name="message" rows={4} placeholder="Tell us what you’d like to explore in the demo." className={`${fieldClass} resize-y py-3`} />
      </label>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="focus-ring-on-accent hover-lift mt-1 inline-flex min-h-13 items-center justify-center gap-2 rounded-[var(--radius-control)] bg-accent px-6 text-[0.95rem] font-semibold text-text-light transition-colors duration-200 hover:bg-accent-strong disabled:cursor-wait disabled:opacity-70"
      >
        {status === "submitting" ? (
          <><LoaderCircle className="animate-spin" aria-hidden="true" size={19} /> Sending request…</>
        ) : (
          "Request My Demo"
        )}
      </button>
      <p className="text-center text-xs leading-relaxed text-muted-light">
        We’ll only use your details to arrange your demo.
      </p>
    </form>
  );
}
