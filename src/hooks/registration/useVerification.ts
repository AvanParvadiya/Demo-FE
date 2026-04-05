import { useApiMutation } from "@/hooks";
import { API_ENDPOINTS } from "@/lib";
import { VerificationFormData, verificationSchema } from "@/schemas/registration";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

/** Configuration constants */
const RESEND_COOLDOWN = 6; // seconds

interface UseVerificationProps {
  email: string;
  initialOtp: string;
  onSuccess: (data: VerificationFormData) => void;
}

/**
 * useVerification Hook
 * Encapsulates the logic for email verification, OTP management,
 * and security cooldown timers.
 * 
 * @param email - The auditor's email address
 * @param initialOtp - The first OTP generated during identification
 * @param onSuccess - Callback triggered when verification is confirmed
 */
export function useVerification({ email, initialOtp, onSuccess }: UseVerificationProps) {
  // Countdown for the 'Resend' button cooldown
  const [countdown, setCountdown] = useState(RESEND_COOLDOWN);
  // Current valid OTP for dev/testing visibility
  const [displayOtp, setDisplayOtp] = useState(initialOtp);

  // --- API Mutations ---
  
  /** Requests a new 6-digit OTP code */
  const { mutate: sendOtp, loading: resending } = useApiMutation<
    { email: string },
    { otp: string }
  >("post", API_ENDPOINTS.OTP.SEND);

  /** Validates the user-entered code against the server-stored value */
  const {
    mutate: verifyOtp,
    loading: verifying,
    error: verifyError,
    reset: resetVerify,
  } = useApiMutation<{ email: string; otp: string }, { verified: boolean }>(
    "post",
    API_ENDPOINTS.OTP.VERIFY
  );

  // --- Form Setup ---

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

  const otpValue = watch("otp");
  const isOtpComplete = otpValue?.length === 6;

  // --- Visuals & Timers ---

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  // --- Actions ---

  /** Resets the cooldown and retrieves a fresh OTP */
  const handleResend = useCallback(async () => {
    setCountdown(RESEND_COOLDOWN);
    const result = await sendOtp({ email });
    if (result) {
      setDisplayOtp(result.otp);
      reset({ otp: "" }); // Clean field for the new credential
    }
  }, [sendOtp, email, reset]);

  /** Persists the verification to the platform */
  const handleVerify = useCallback(async (data: VerificationFormData) => {
    const result = await verifyOtp({ email, otp: data.otp });
    if (result?.verified) {
      onSuccess(data);
    }
  }, [verifyOtp, email, onSuccess]);

  return {
    control,
    handleSubmit: handleSubmit(handleVerify),
    errors,
    countdown,
    displayOtp,
    resending,
    verifying,
    verifyError,
    resetVerify,
    isOtpComplete,
    handleResend,
  };
}
