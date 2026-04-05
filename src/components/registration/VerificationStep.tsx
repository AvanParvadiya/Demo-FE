import { useState, useEffect, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import {
  verificationSchema,
  VerificationFormData,
} from "@/schemas/registration";
import OtpInput from "./OtpInput";

const TEST_OTP = "123456";
const RESEND_COOLDOWN = 60; // seconds

interface VerificationStepProps {
  email: string;
  onNext: (data: VerificationFormData) => void;
  onBack: () => void;
}

export default function VerificationStep({
  email,
  onNext,
  onBack,
}: VerificationStepProps) {
  const [countdown, setCountdown] = useState(RESEND_COOLDOWN);
  const [otpError, setOtpError] = useState("");

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<VerificationFormData>({
    resolver: zodResolver(verificationSchema),
    defaultValues: { otp: "" },
  });

  // Countdown timer for resend
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const handleResend = useCallback(() => {
    setCountdown(RESEND_COOLDOWN);
    setOtpError("");
  }, []);

  const onSubmit = (data: VerificationFormData) => {
    if (data.otp !== TEST_OTP) {
      setOtpError("Invalid OTP. Please try again.");
      return;
    }
    setOtpError("");
    onNext(data);
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
          For testing, use code: <strong>{TEST_OTP}</strong>
        </Alert>
      </Stack>

      <Controller
        name="otp"
        control={control}
        render={({ field }) => (
          <OtpInput
            value={field.value}
            onChange={field.onChange}
            error={!!errors.otp || !!otpError}
            helperText={errors.otp?.message || otpError}
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
            sx={{ cursor: "pointer", fontWeight: 600 }}
            onClick={handleResend}
          >
            Resend OTP
          </Typography>
        )}
      </Typography>

      <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
        <Button
          variant="outlined"
          size="large"
          fullWidth
          onClick={onBack}
          sx={{ py: 1.4, fontSize: "1rem", fontWeight: 600 }}
        >
          Back
        </Button>
        <Button
          type="submit"
          variant="contained"
          size="large"
          fullWidth
          sx={{ py: 1.4, fontSize: "1rem", fontWeight: 600 }}
        >
          Verify
        </Button>
      </Stack>
    </Box>
  );
}
