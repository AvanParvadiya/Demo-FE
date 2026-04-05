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

export default function RegisterPage() {
  const [activeStep, setActiveStep] = useState(0);
  const [completed, setCompleted] = useState(false);

  // Accumulated data across steps
  const [identificationData, setIdentificationData] =
    useState<Partial<IdentificationFormData>>({});
  const [certifications, setCertifications] = useState<CertificationFormData[]>(
    []
  );
  const [profileDefaults, setProfileDefaults] = useState<
    Partial<ProfileFormData>
  >({});

  // --- Step handlers ---
  const handleStep1Next = useCallback((data: IdentificationFormData) => {
    setIdentificationData(data);
    setActiveStep(1);
  }, []);

  const handleStep2Next = useCallback((_data: VerificationFormData) => {
    setActiveStep(2);
  }, []);

  const handleStep3Next = useCallback(
    (data: ProfileFormData) => {
      setProfileDefaults(data);

      const finalData: RegistrationData = {
        firstName: identificationData.firstName ?? "",
        lastName: identificationData.lastName ?? "",
        email: identificationData.email ?? "",
        otp: "",
        ...data,
        certifications,
      };

      // TODO: Submit to API
      console.log("Registration complete:", finalData);
      setCompleted(true);
    },
    [identificationData, certifications]
  );

  const handleBack = useCallback(() => {
    setActiveStep((prev) => prev - 1);
  }, []);

  // --- Completion screen ---
  if (completed) {
    return (
      <>
        <Head>
          <title>Registration Complete</title>
        </Head>
        <Box
          sx={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "background.default",
          }}
        >
          <Paper
            elevation={0}
            sx={{
              maxWidth: 520,
              width: "100%",
              p: { xs: 3, sm: 5 },
              borderRadius: 4,
              border: "1px solid",
              borderColor: "grey.200",
              textAlign: "center",
            }}
          >
            <CheckCircleOutlineIcon
              sx={{ fontSize: 72, color: "success.main", mb: 2 }}
            />
            <Typography variant="h4" fontWeight={700} gutterBottom>
              Registration Complete!
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ mb: 3 }}
            >
              Your auditor profile has been created successfully. You can now
              access the platform.
            </Typography>
            <Stack direction="row" spacing={2} justifyContent="center">
              <Button variant="contained" size="large" href="/">
                Go to Home
              </Button>
            </Stack>
          </Paper>
        </Box>
      </>
    );
  }

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
              />
            )}
          </Paper>
        </Container>
      </Box>
    </>
  );
}
