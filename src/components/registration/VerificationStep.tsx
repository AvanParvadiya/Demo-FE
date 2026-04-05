import { LoadingButton } from "@/components/common";
import { useApiMutation } from "@/hooks";
import { API_ENDPOINTS } from "@/lib";
import {
  VerificationFormData,
  verificationSchema,
} from "@/schemas/registration";
import { zodResolver } from "@hookform/resolvers/zod";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import OtpInput from "./OtpInput";

/** Configuration constants */
const RESEND_COOLDOWN = 60; // seconds

interface VerificationStepProps {
  /** The email address being verified */
  email: string;
  /** Initial OTP code from Step 0 (simulated for dev visibility) */
  otpCode: string;
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
  onNext,
  onBack,
}: VerificationStepProps) {
  // Countdown for the 'Resend' button cooldown
  const [countdown, setCountdown] = useState(RESEND_COOLDOWN);
  // Current valid OTP for dev/testing visibility
  const [displayOtp, setDisplayOtp] = useState(otpCode);

  // Hook handles resending a new OTP to the same email
  const { mutate: sendOtp, loading: resending } = useApiMutation<
    { email: string },
    { otp: string }
  >("post", API_ENDPOINTS.OTP.SEND);

  // Hook handles verifying the user-entered OTP code
  const {
    mutate: verifyOtp,
    loading: verifying,
    error: verifyError,
    reset: resetVerify,
  } = useApiMutation<{ email: string; otp: string }, { verified: boolean }>(
    "post",
    API_ENDPOINTS.OTP.VERIFY
  );

  // Form setup for the single OTP input field
  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<VerificationFormData>({
    resolver: zodResolver(verificationSchema),
    defaultValues: { otp: "" },
  });

  // Watch OTP value to determine if 'Verify' button should be active
  const otpValue = watch("otp");
  const isOtpComplete = otpValue?.length === 6;

  // Manage the resend cooldown timer
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  /**
   * Resend Handler
   * Resets the cooldown timer and requests a new OTP from the server.
   */
  const handleResend = useCallback(async () => {
    setCountdown(RESEND_COOLDOWN);
    const result = await sendOtp({ email });
    if (result) {
      setDisplayOtp(result.otp);
      reset({ otp: "" }); // Clear the input field for the new code
    }
  }, [sendOtp, email, reset]);

  /**
   * Final Verification Submission
   */
  const onSubmit = async (data: VerificationFormData) => {
    const result = await verifyOtp({ email, otp: data.otp });
    if (result?.verified) {
      onNext(data); // Identification + OTP confirmed, proceed to profile
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      {/* Header icon and title */}
      <Stack alignItems="center" spacing={1.5} sx={{ mb: 4 }}>
        <Box
          sx={{
            width: 64,
            height: 64,
            borderRadius: "16px",
            bgcolor: "primary.main",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 8px 16px rgba(var(--primary-rgb), 0.2)",
            mb: 1,
          }}
        >
          <MailOutlineIcon sx={{ fontSize: 32, color: "#fff" }} />
        </Box>

        <Typography variant="h5" fontWeight={800} sx={{ letterSpacing: "-0.02em" }}>
          Verify Your Email
        </Typography>

        <Typography variant="body2" color="text.secondary" textAlign="center">
          We&apos;ve sent a secure 6-digit code to{" "}
          <Typography component="span" fontWeight={700} color="text.primary">
            {email}
          </Typography>
        </Typography>

        {/* Development testing hint */}
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
          />
        )}
      />

      {/* Resend Logic Display */}
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
          fullWidth
          loading={verifying}
          loadingText="Authenticating…"
          disabled={!isOtpComplete}
          sx={{ py: 1.6, fontSize: "0.95rem", fontWeight: 800, borderRadius: 2.5 }}
        >
          Verify Account
        </LoadingButton>
      </Stack>
    </Box>
  );
}

