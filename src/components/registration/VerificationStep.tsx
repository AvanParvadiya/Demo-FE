import { LoadingButton } from "@/components/common";
import { useApiMutation } from "@/hooks";
import { API_ENDPOINTS } from "@/lib";
import {
  VerificationFormData,
  verificationSchema,
} from "@/schemas/registration";
import { zodResolver } from "@hookform/resolvers/zod";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useCallback, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import OtpInput from "./OtpInput";

const RESEND_COOLDOWN = 60; // seconds

interface SendOtpResponse {
  message: string;
  otp: string;
  expiresInSeconds: number;
}

interface VerifyOtpResponse {
  message: string;
  verified: boolean;
}

interface VerificationStepProps {
  email: string;
  /** OTP code returned from backend (for testing display) */
  otpCode: string;
  onNext: (data: VerificationFormData) => void;
  onBack: () => void;
}

export default function VerificationStep({
  email,
  otpCode,
  onNext,
  onBack,
}: VerificationStepProps) {
  const [countdown, setCountdown] = useState(RESEND_COOLDOWN);
  const [displayOtp, setDisplayOtp] = useState(otpCode);

  // Hook for resending OTP
  const {
    mutate: sendOtp,
    loading: sending,
  } = useApiMutation<{ email: string }, SendOtpResponse>(
    "post",
    API_ENDPOINTS.OTP.SEND
  );

  // Hook for verifying OTP
  const {
    mutate: verifyOtp,
    loading: verifying,
    error: verifyError,
  } = useApiMutation<{ email: string; otp: string }, VerifyOtpResponse>(
    "post",
    API_ENDPOINTS.OTP.VERIFY
  );

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<VerificationFormData>({
    resolver: zodResolver(verificationSchema),
    defaultValues: { otp: "" },
  });

  // Watch OTP value to enable/disable Verify button
  const otpValue = watch("otp");
  const isOtpComplete = otpValue?.length === 6;

  // Countdown timer for resend
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const handleResend = useCallback(async () => {
    setCountdown(RESEND_COOLDOWN);
    const result = await sendOtp({ email });
    if (result) {
      setDisplayOtp(result.otp);
    }
  }, [sendOtp, email]);

  const onSubmit = async (data: VerificationFormData) => {
    const result = await verifyOtp({ email, otp: data.otp });
    if (result?.verified) {
      onNext(data);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <Stack alignItems="center" spacing={1.5} sx={{ mb: 3 }}>
        <Box
          sx={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            bgcolor: "primary.light",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 0.5,
          }}
        >
          <MailOutlineIcon sx={{ fontSize: 30, color: "#fff" }} />
        </Box>

        <Typography variant="h5" fontWeight={700}>
          Security Verification
        </Typography>

        <Typography variant="body2" color="text.secondary">
          We&apos;ve sent a 6-digit code to{" "}
          <Typography component="span" fontWeight={700} variant="body2">
            {email}
          </Typography>
        </Typography>

        <Alert severity="info" sx={{ width: "100%", borderRadius: 2 }}>
          {sending ? (
            <Stack direction="row" alignItems="center" spacing={1}>
              <CircularProgress size={16} />
              <span>Sending new OTP…</span>
            </Stack>
          ) : (
            <>
              For testing, use code: <strong>{displayOtp}</strong>
            </>
          )}
        </Alert>
      </Stack>

      <Controller
        name="otp"
        control={control}
        render={({ field }) => (
          <OtpInput
            value={field.value}
            onChange={field.onChange}
            error={!!errors.otp || !!verifyError}
            helperText={errors.otp?.message || verifyError || ""}
          />
        )}
      />

      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ textAlign: "center", mt: 2 }}
      >
        {countdown > 0 ? (
          <>
            Resend OTP in{" "}
            <Typography component="span" fontWeight={700} variant="body2">
              {countdown}s
            </Typography>
          </>
        ) : (
          <Typography
            component="span"
            variant="body2"
            color="primary"
            sx={{
              cursor: sending ? "default" : "pointer",
              fontWeight: 600,
            }}
            onClick={sending ? undefined : handleResend}
          >
            {sending ? "Sending…" : "Resend OTP"}
          </Typography>
        )}
      </Typography>

      <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
        <Button
          variant="outlined"
          size="large"
          fullWidth
          onClick={onBack}
          disabled={verifying}
          sx={{ py: 1.4, fontSize: "1rem", fontWeight: 600 }}
        >
          Back
        </Button>
        <LoadingButton
          type="submit"
          variant="contained"
          size="large"
          fullWidth
          loading={verifying}
          loadingText="Verifying…"
          disabled={!isOtpComplete}
          sx={{ py: 1.4, fontSize: "1rem", fontWeight: 600 }}
        >
          Verify
        </LoadingButton>
      </Stack>
    </Box>
  );
}
