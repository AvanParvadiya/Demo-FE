import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Head from "next/head";
import { useCallback, useState } from "react";

import IdentificationStep from "@/components/registration/IdentificationStep";
import ProfileStep from "@/components/registration/ProfileStep";
import StepperHeader from "@/components/registration/StepperHeader";
import VerificationStep from "@/components/registration/VerificationStep";

import type { CertificationFormData, IdentificationFormData, ProfileFormData, RegistrationData, VerificationFormData } from "@/schemas/registration";

import { useApiMutation } from "@/hooks";
import { API_ENDPOINTS } from "@/lib";

import { useRouter } from "next/router";

export default function RegisterPage() {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);

  const {
    mutate: register,
    loading: registering,
    error: registrationError,
  } = useApiMutation<RegistrationData, any>("post", API_ENDPOINTS.USERS.REGISTER);

  // Accumulated data across steps
  const [identificationData, setIdentificationData] =
    useState<Partial<IdentificationFormData>>({});
  const [certifications, setCertifications] = useState<CertificationFormData[]>(
    []
  );
  const [profileDefaults, setProfileDefaults] = useState<
    Partial<ProfileFormData>
  >({});
  const [otpCode, setOtpCode] = useState("");

  // --- Step handlers ---
  const handleStep1Next = useCallback(
    (data: IdentificationFormData, otp: string) => {
      setIdentificationData(data);
      setOtpCode(otp);
      setActiveStep(1);
    },
    []
  );

  const handleStep2Next = useCallback((data: VerificationFormData) => {
    setOtpCode(data.otp);
    setActiveStep(2);
  }, []);

  const handleStep3Next = useCallback(
    async (data: ProfileFormData) => {
      setProfileDefaults(data);

      const finalData: RegistrationData = {
        firstName: identificationData.firstName ?? "",
        lastName: identificationData.lastName ?? "",
        email: identificationData.email ?? "",
        otp: otpCode,
        ...data,
        certifications,
      };

      const result = await register(finalData);
      if (result) {
        await router.push("/users");
      }
    },
    [identificationData, certifications, otpCode, register, router]
  );

  const handleBack = useCallback(() => {
    setActiveStep((prev) => prev - 1);
  }, []);


  return (
    <>
      <Head>
        <title>Register — Auditor Onboarding</title>
        <meta
          name="description"
          content="Create your auditor account with identity verification and profile setup."
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
          <StepperHeader activeStep={activeStep} />
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, sm: 5 },
              borderRadius: 4,
              border: "1px solid",
              borderColor: "grey.200",
            }}
          >

            {activeStep === 0 && (
              <IdentificationStep
                defaultValues={identificationData}
                onNext={handleStep1Next}
              />
            )}

            {activeStep === 1 && (
              <VerificationStep
                email={identificationData.email ?? ""}
                otpCode={otpCode}
                onNext={handleStep2Next}
                onBack={handleBack}
              />
            )}

            {activeStep === 2 && (
              <ProfileStep
                defaultValues={profileDefaults}
                certifications={certifications}
                onCertificationsChange={setCertifications}
                onNext={handleStep3Next}
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
