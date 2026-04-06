import { LoadingButton } from "@/components/common";
import { useVerification } from "@/hooks/registration/useVerification";
import { VerificationFormData } from "@/schemas/registration";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";
import { Controller } from "react-hook-form";
import OtpInput from "./OtpInput";

interface VerificationStepProps {
  /** The email address being verified */
  email: string;
  /** Initial OTP code from Step 0 (simulated for dev visibility) */
  otpCode: string;
  /** Whether the email has already been verified */
  verified?: boolean;
  /** Callback triggering move to Step 2 (Profile Setup) */
  onNext: (data: VerificationFormData) => void;
  /** Callback to return to identity step */
  onBack: () => void;
}

/**
 * Step 1: Security Verification
 * Validates the auditor's email ownership via a 6-digit OTP.
 */
export default function VerificationStep({
  email,
  otpCode,
  verified = false,
  onNext,
  onBack,
}: VerificationStepProps) {
  // Use custom hook for OTP logic and timers
  const {
    control,
    handleSubmit,
    errors,
    countdown,
    displayOtp,
    resending,
    verifying,
    verifyError,
    resetVerify,
    isOtpComplete,
    handleResend,
  } = useVerification({
    email,
    initialOtp: otpCode,
    verified,
    onSuccess: onNext,
  });

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      {/* Header icon and title */}
      <Stack alignItems="center" spacing={1.5} sx={{ mb: 4 }}>
        <Box
          sx={{
            width: 64,
            height: 64,
            borderRadius: "16px",
            bgcolor: verified ? "success.main" : "primary.main",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: verified
              ? "0 8px 16px rgba(var(--success-rgb), 0.2)"
              : "0 8px 16px rgba(var(--primary-rgb), 0.2)",
            mb: 1,
            transition: "all 0.3s ease",
          }}
        >
          <MailOutlineIcon sx={{ fontSize: 32, color: "#fff" }} />
        </Box>

        <Typography variant="h5" fontWeight={800} sx={{ letterSpacing: "-0.02em" }}>
          {verified ? "Email Verified" : "Verify Your Email"}
        </Typography>

        <Typography variant="body2" color="text.secondary" textAlign="center">
          {verified
            ? "Your email has been successfully verified. You can proceed to the next step."
            : "We've sent a secure 6-digit code to "}
          <Typography component="span" fontWeight={700} color="text.primary">
            {email}
          </Typography>
        </Typography>

        {/* Development testing hint */}
        {!verified && (
          <Alert severity="info" sx={{ width: "100%", borderRadius: 2.5, mt: 1 }}>
            {resending ? (
              <Stack direction="row" alignItems="center" spacing={1.5}>
                <CircularProgress size={16} thickness={5} />
                <Typography variant="caption" fontWeight={600}>Sending New Code…</Typography>
              </Stack>
            ) : (
              <Typography variant="body2">
                For testing, use code: <strong>{displayOtp}</strong>
              </Typography>
            )}
          </Alert>
        )}
      </Stack>

      {/* Main OTP Input Section */}
      <Controller
        name="otp"
        control={control}
        render={({ field }) => (
          <OtpInput
            value={field.value}
            onChange={(val) => {
              field.onChange(val);
              // Clear previous API errors when the user starts typing again
              if (verifyError) resetVerify();
            }}
            error={!!errors.otp || !!verifyError}
            helperText={errors.otp?.message || (verifyError as string) || ""}
            disabled={verified}
          />
        )}
      />

      {/* Resend Logic Display */}
      {!verified && (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ textAlign: "center", mt: 3 }}
        >
          {countdown > 0 ? (
            <>
              Didn&apos;t receive it? Resend in{" "}
              <Typography component="span" fontWeight={700} color="text.primary">
                {countdown}s
              </Typography>
            </>
          ) : (
            <Button
              size="small"
              onClick={resending ? undefined : handleResend}
              disabled={resending}
              sx={{ fontWeight: 700, textTransform: "none" }}
            >
              {resending ? "Sending…" : "Resend OTP Now"}
            </Button>
          )}
        </Typography>
      )}

      {/* Footer Navigation */}
      <Stack direction={{ xs: "column-reverse", sm: "row" }} spacing={2} sx={{ mt: 5 }}>
        <Button
          variant="outlined"
          size="large"
          fullWidth
          onClick={onBack}
          disabled={verifying}
          sx={{ py: 1.6, fontSize: "0.95rem", fontWeight: 700, borderRadius: 2.5 }}
        >
          Back
        </Button>
        <LoadingButton
          type="submit"
          variant="contained"
          size="large"
          color={verified ? "success" : "primary"}
          fullWidth
          loading={verifying}
          loadingText="Authenticating…"
          disabled={!isOtpComplete && !verified}
          sx={{ py: 1.6, fontSize: "0.95rem", fontWeight: 800, borderRadius: 2.5 }}
        >
          {verified ? "Next Step" : "Verify Account"}
        </LoadingButton>
      </Stack>
    </Box>
  );
}


