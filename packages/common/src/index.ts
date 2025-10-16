import { z } from "zod";

export const requestOTPSchema = z.object({
  mobile: z.string().regex(/^\d{10}$/, "Invalid Indian mobile number"),
});

export const verifyOTPSchema = z.object({
  mobile: z.string().regex(/^\d{10}$/, "Invalid Indian mobile number"),
  otp: z.string().length(6, "OTP must be 6 digits"),
});
