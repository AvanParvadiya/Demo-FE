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
  specializedAuditArea: z.string().min(1, "Specialized audit area is required"),
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
  type: z.string().min(1, "Certification type is required"),
  licenseNumber: z.string().min(1, "License number is required"),
  year: z
    .string()
    .min(1, "Year is required")
    .regex(/^\d{4}$/, "Enter a valid 4-digit year")
    .refine((val) => {
      const year = parseInt(val);
      const currentYear = new Date().getFullYear();
      return year >= 1900 && year <= currentYear;
    }, "Enter a realistic qualification year"),
});

export type CertificationFormData = z.infer<typeof certificationSchema>;

// --- Full registration data ---
export interface RegistrationData {
  firstName: string;
  lastName: string;
  email: string;
  otp: string;
  primaryAuditSector: string;
  specializedAuditArea: string;
  jurisdictions: string[];
  independenceDeclaration: true;
  certifications: CertificationFormData[];
}

// --- Constants ---

export const CERTIFICATION_TYPES = [
  { label: "CA", value: "CA" },
  { label: "ACCA", value: "ACCA" },
  { label: "CPA", value: "CPA" },
  { label: "CIA", value: "CIA" },
  { label: "CISA", value: "CISA" },
];

export const AUDIT_SECTOR_MAPPING: Record<string, { label: string; value: string }[]> = {
  "Financial Services": [
    { label: "Banking", value: "Banking" },
    { label: "Insurance", value: "Insurance" },
    { label: "Asset Management", value: "Asset Management" },
  ],
  Manufacturing: [
    { label: "Automotive", value: "Automotive" },
    { label: "Consumer Goods", value: "Consumer Goods" },
    { label: "Industrial Products", value: "Industrial Products" },
  ],
  "Public Sector": [
    { label: "Healthcare", value: "Healthcare" },
    { label: "Education", value: "Education" },
    { label: "Local Government", value: "Local Government" },
  ],
};

export const AUDIT_SECTORS = Object.keys(AUDIT_SECTOR_MAPPING).map((key) => ({
  label: key,
  value: key,
}));

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


