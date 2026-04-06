import { Box, Container, Fade, Paper } from "@mui/material";
import Head from "next/head";

// Components
import IdentificationStep from "@/components/registration/IdentificationStep";
import ProfileStep from "@/components/registration/ProfileStep";
import RegistrationSuccess from "@/components/registration/RegistrationSuccess";
import StepperHeader from "@/components/registration/StepperHeader";
import VerificationStep from "@/components/registration/VerificationStep";

// Types & Hooks
import { useRegistration } from "@/hooks/registration/useRegistration";

/**
 * RegisterPage Component
 * Orchestrates the multi-step registration wizard for new auditors.
 * Logic is moved to useRegistration hook for maintainability.
 */
export default function RegisterPage() {
  const {
    activeStep,
    identification,
    certifications,
    setCertifications,
    profile,
    otp,
    isOtpVerified,
    registering,
    registrationError,
    isSuccessStep,
    handleStep1Submit,
    handleStep2Submit,
    handleFinalSubmit,
    handleBack,
  } = useRegistration();

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
          transition: "background-color 0.5s ease",
        }}
      >
        <Container maxWidth="sm" disableGutters sx={{ px: { xs: 2, sm: 0 } }}>
          {/* Visual progress indicator (hidden on success step) */}
          {!isSuccessStep && (
            <Fade in={!isSuccessStep}>
              <Box>
                <StepperHeader activeStep={activeStep} />
              </Box>
            </Fade>
          )}

          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, sm: isSuccessStep ? 8 : 5 },
              borderRadius: isSuccessStep ? 6 : 4,
              border: "1px solid",
              borderColor: isSuccessStep ? "success.light" : "grey.200",
              boxShadow: isSuccessStep
                ? "0 12px 48px rgba(0,0,0,0.06)"
                : "0 4px 12px rgba(0,0,0,0.03)",
              transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
              bgcolor: "#fff",
            }}
          >
            {/* Step Mapping - More concise than switch/if blocks */}
            {
              {
                0: (
                  <IdentificationStep
                    defaultValues={identification}
                    onNext={handleStep1Submit}
                  />
                ),
                1: (
                  <VerificationStep
                    email={identification.email ?? ""}
                    otpCode={otp}
                    verified={isOtpVerified}
                    onNext={handleStep2Submit}
                    onBack={handleBack}
                  />
                ),
                2: (
                  <ProfileStep
                    defaultValues={profile}
                    certifications={certifications}
                    onCertificationsChange={setCertifications}
                    onNext={handleFinalSubmit}
                    onBack={handleBack}
                    loading={registering}
                    error={registrationError}
                  />
                ),
                3: <RegistrationSuccess />,
              }[activeStep]
            }
          </Paper>
        </Container>
      </Box>
    </>
  );
}

