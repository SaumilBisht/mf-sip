import { z } from "zod";

export const requestOTPSchema = z.object({
  mobile: z.string().regex(/^\d{10}$/, "Invalid Indian mobile number"),
});

export const verifyOTPSchema = z.object({
  mobile: z.string().regex(/^\d{10}$/, "Invalid Indian mobile number"),
  otp: z.string().length(6, "OTP must be 6 digits"),
});

export const personalInfoSchema = z.object({
  fatherName: z.string().min(1, "Father's name is required"),
  motherName: z.string().min(1, "Mother's name is required"),
  maritalStatus: z.enum(["SINGLE", "MARRIED", "DIVORCED", "WIDOWED", "OTHER"]),
  education: z.enum(["UNDERGRADUATE", "GRADUATE", "POST_GRADUATE", "DOCTORATE", "OTHER"]),
  gender: z.enum(["MALE", "FEMALE", "OTHER", "PREFER_NOT_TO_SAY"]),
  residentialStatus: z.enum(["RESIDENT_INDIVIDUAL", "NRI", "FOREIGN_NATIONAL"]),
  occupationType: z.enum([
    "PRIVATE_SECTOR",
    "PUBLIC_SECTOR",
    "GOVERNMENT_SERVICE",
    "BUSINESS",
    "PROFESSIONAL",
    "STUDENT",
    "RETIRED",
    "HOUSEWIFE",
    "OTHER",
  ]),
  countryOfBirth: z.string().optional(),
  nationality: z.string().optional(),
});

export const financialInfoSchema = z.object({
  annualIncome: z.enum([
    "BELOW_2_LAKH",
    "TWO_TO_FIVE_LAKH",
    "FIVE_TO_TEN_LAKH",
    "TEN_TO_TWENTYFIVE_LAKH",
    "ABOVE_25_LAKH",
    "OTHER",
  ]),
  incomeSource: z.enum([
    "SALARIED",
    "SELF_EMPLOYED",
    "BUSINESS_OWNER",
    "STUDENT",
    "RETIRED",
    "OTHER",
  ]),
  taxResidency: z.enum(["INDIA", "NRI", "FOREIGN_NATIONAL"]),
});