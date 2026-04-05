import { Box, Container, Paper } from "@mui/material";
import Head from "next/head";
import { useRouter } from "next/router";
import { useCallback, useState } from "react";

// Components
import IdentificationStep from "@/components/registration/IdentificationStep";
import ProfileStep from "@/components/registration/ProfileStep";
import StepperHeader from "@/components/registration/StepperHeader";
import VerificationStep from "@/components/registration/VerificationStep";

// Types & Hooks
import { useApiMutation } from "@/hooks";
import { API_ENDPOINTS } from "@/lib";
import type {
  CertificationFormData,
  IdentificationFormData,
  ProfileFormData,
  RegistrationData,
  VerificationFormData,
} from "@/schemas/registration";

/**
 * RegisterPage Component
 * Orchestrates the multi-step registration wizard for new auditors.
 * Steps:
 * 0. Identification (Basic Info + OTP Sent)
 * 1. Verification (OTP Validation)
 * 2. Profile Setup (Sectors, Jurisdictions & Certifications)
 */
export default function RegisterPage() {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);

  // --- API Mutation ---
  const {
    mutate: register,
    loading: registering,
    error: registrationError,
  } = useApiMutation<RegistrationData, any>("post", API_ENDPOINTS.USERS.REGISTER);

  // --- Wizard State ---
  // We keep state local to this orchestration component so data isn't lost when moving between steps
  const [identification, setIdentification] = useState<Partial<IdentificationFormData>>({});
  const [certifications, setCertifications] = useState<CertificationFormData[]>([]);
  const [profile, setProfile] = useState<Partial<ProfileFormData>>({});
  const [otp, setOtp] = useState("");

  // --- Navigation Handlers ---

  /** Step 0 -> 1: Identification complete, OTP sent to email */
  const handleStep1Submit = useCallback(
    (data: IdentificationFormData, otpCode: string) => {
      setIdentification(data);
      setOtp(otpCode);
      setActiveStep(1);
    },
    []
  );

  /** Step 1 -> 2: Email verified via OTP */
  const handleStep2Submit = useCallback((data: VerificationFormData) => {
    setOtp(data.otp);
    setActiveStep(2);
  }, []);

  /** Step 2 -> Final: Profile complete, submit entire registration payload */
  const handleStep3Submit = useCallback(
    async (profileData: ProfileFormData) => {
      setProfile(profileData);

      // Construct the comprehensive registration object
      const payload: RegistrationData = {
        firstName: identification.firstName ?? "",
        lastName: identification.lastName ?? "",
        email: identification.email ?? "",
        otp: otp,
        ...profileData,
        certifications,
      };

      const success = await register(payload);
      if (success) {
        // Redirect to the auditor directory upon successful registration
        await router.push("/users");
      }
    },
    [identification, certifications, otp, register, router]
  );

  /** Generic handler to return to previous step */
  const handleBack = useCallback(() => {
    setActiveStep((prev) => prev - 1);
  }, []);

  return (
    <>
      <Head>
        <title>Auditor Registration — Multi-step Onboarding</title>
        <meta
          name="description"
          content="Join the Audit FIS platform. Complete your identification, verify your email, and set up your professional auditor profile."
        />
      </Head>

      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "background.default",
          py: 4,
        }}
      >
        <Container maxWidth="sm" disableGutters sx={{ px: { xs: 2, sm: 0 } }}>
          {/* Visual progress indicator */}
          <StepperHeader activeStep={activeStep} />

          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, sm: 5 },
              borderRadius: 4,
              border: "1px solid",
              borderColor: "grey.200",
              boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
            }}
          >
            {/* Step 0: User Identity & OTP Dispatch */}
            {activeStep === 0 && (
              <IdentificationStep
                defaultValues={identification}
                onNext={handleStep1Submit}
              />
            )}

            {/* Step 1: OTP Verification */}
            {activeStep === 1 && (
              <VerificationStep
                email={identification.email ?? ""}
                otpCode={otp}
                onNext={handleStep2Submit}
                onBack={handleBack}
              />
            )}

            {/* Step 2: Professional Details & Certifications */}
            {activeStep === 2 && (
              <ProfileStep
                defaultValues={profile}
                certifications={certifications}
                onCertificationsChange={setCertifications}
                onNext={handleStep3Submit}
                onBack={handleBack}
                loading={registering}
                error={registrationError}
              />
            )}
          </Paper>
        </Container>
      </Box>
    </>
  );
}
