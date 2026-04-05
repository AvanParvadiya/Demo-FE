import { z } from "zod";

// --- Step 1: Identification ---
export const identificationSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
});

export type IdentificationFormData = z.infer<typeof identificationSchema>;

// --- Step 2: Verification ---
export const verificationSchema = z.object({
  otp: z
    .string()
    .length(6, "OTP must be 6 digits")
    .regex(/^\d+$/, "OTP must contain only numbers"),
});

export type VerificationFormData = z.infer<typeof verificationSchema>;

// --- Step 3: Profile ---
export const profileSchema = z.object({
  primaryAuditSector: z.string().min(1, "Primary audit sector is required"),
  specializedAuditArea: z.string().optional(),
  jurisdictions: z
    .array(z.string())
    .min(1, "Select at least one jurisdiction"),
  independenceDeclaration: z.literal(true, {
    message: "You must accept the independence declaration",
  }),
});

export type ProfileFormData = z.infer<typeof profileSchema>;

// --- Certification (used in step 3 as a dynamic list) ---
export const certificationSchema = z.object({
  name: z.string().min(1, "Certification name is required"),
  issuingBody: z.string().min(1, "Issuing body is required"),
  year: z
    .string()
    .min(1, "Year is required")
    .regex(/^\d{4}$/, "Enter a valid year"),
});

export type CertificationFormData = z.infer<typeof certificationSchema>;

// --- Full registration data ---
export interface RegistrationData {
  firstName: string;
  lastName: string;
  email: string;
  otp: string;
  primaryAuditSector: string;
  specializedAuditArea?: string;
  jurisdictions: string[];
  independenceDeclaration: true;
  certifications: CertificationFormData[];
}

// --- Constants ---
export const AUDIT_SECTORS = [
  "Financial Services",
  "Healthcare",
  "Technology",
  "Manufacturing",
  "Energy & Utilities",
  "Government & Public Sector",
  "Retail & Consumer",
  "Real Estate",
];

export const SPECIALIZED_AREAS = [
  "Internal Audit",
  "External Audit",
  "IT Audit",
  "Forensic Audit",
  "Compliance Audit",
  "Environmental Audit",
  "Tax Audit",
];

export const JURISDICTIONS = [
  { label: "UK - IFRS", value: "UK_IFRS" },
  { label: "US - GAAP", value: "US_GAAP" },
  { label: "India - ICAI", value: "INDIA_ICAI" },
  { label: "EU - IFRS", value: "EU_IFRS" },
  { label: "Australia - AASB", value: "AUSTRALIA_AASB" },
  { label: "Canada - CPA", value: "CANADA_CPA" },
  { label: "Singapore - SFRS", value: "SINGAPORE_SFRS" },
];

export const STEP_LABELS = ["Identification", "Verification", "Profile"];
