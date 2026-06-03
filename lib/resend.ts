import { Resend } from "resend";

export const resend = new Resend(
  process.env.RESEND_API_KEY || "re_dummy_build_placeholder",
);

export const EMAIL_FROM = "SMARTSIS HIMASIS <onboarding@resend.dev>";

export const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
