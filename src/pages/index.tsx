import { useState, useCallback } from "react";
import Head from "next/head";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

import StepperHeader from "@/components/registration/StepperHeader";
import IdentificationStep from "@/components/registration/IdentificationStep";
import VerificationStep from "@/components/registration/VerificationStep";
import ProfileStep from "@/components/registration/ProfileStep";

import type {
  IdentificationFormData,
  VerificationFormData,
  ProfileFormData,
  CertificationFormData,
  RegistrationData,
} from "@/schemas/registration";

export default function Home() {
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
          <title>Registration Complete — Audit FIS</title>
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
              access the Audit FIS platform.
            </Typography>
            <Stack direction="row" spacing={2} justifyContent="center">
              <Button
                variant="contained"
                size="large"
                onClick={() => {
                  setCompleted(false);
                  setActiveStep(0);
                  setIdentificationData({});
                  setCertifications([]);
                  setProfileDefaults({});
                }}
              >
                Register Another
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
        <title>Audit FIS — Company Registration</title>
        <meta
          name="description"
          content="Register your company on the Audit FIS platform with identity verification and auditor profile setup."
        />
      </Head>

      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "background.default",
          py: 4,
        }}
      >
        {/* Branding */}
        <Typography
          variant="h4"
          fontWeight={800}
          color="primary.main"
          sx={{ mb: 1, letterSpacing: "-0.02em" }}
        >
          Audit FIS
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 3 }}
        >
          Companies Registration Portal
        </Typography>

        <Container maxWidth="sm" disableGutters sx={{ px: { xs: 2, sm: 0 } }}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, sm: 5 },
              borderRadius: 4,
              border: "1px solid",
              borderColor: "grey.200",
            }}
          >
            <StepperHeader activeStep={activeStep} />

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
