import { useApiMutation } from "@/hooks";
import { API_ENDPOINTS } from "@/lib";
import {
  CertificationFormData,
  IdentificationFormData,
  ProfileFormData,
  RegistrationData,
  VerificationFormData,
} from "@/schemas/registration";
import { useCallback, useState } from "react";

/**
 * useRegistration Hook
 * Orchestrates the full auditor registration wizard lifecycle.
 * Manages multi-step navigation, intermediate form state persistence,
 * and the final comprehensive registration submission.
 */
export function useRegistration() {
  const [activeStep, setActiveStep] = useState(0);
  // --- Wizard Local State Persistence ---
  const [identification, setIdentification] = useState<Partial<IdentificationFormData>>({});
  const [certifications, setCertifications] = useState<CertificationFormData[]>([]);
  const [profile, setProfile] = useState<Partial<ProfileFormData>>({});
  const [otp, setOtp] = useState("");
  const [isOtpVerified, setIsOtpVerified] = useState(false);

  // --- API Mutation ---
  const {
    mutate: register,
    loading: registering,
    error: registrationError,
  } = useApiMutation<RegistrationData, any>("post", API_ENDPOINTS.USERS.REGISTER);


  /** Step 0 -> 1: Identification complete, OTP sent to email */
  const handleStep1Submit = useCallback(
    (data: IdentificationFormData, otpCode: string) => {
      setIdentification(data);
      setOtp(otpCode);
      setIsOtpVerified(false);
      setActiveStep(1);
    },
    []
  );

  /** Step 1 -> 2: Email verified via OTP */
  const handleStep2Submit = useCallback((data: VerificationFormData) => {
    setOtp(data.otp);
    setIsOtpVerified(true);
    setActiveStep(2);
  }, []);

  /** Step 2 -> Final: Submit the entire registration payload */
  const handleFinalSubmit = useCallback(
    async (profileData: ProfileFormData) => {
      setProfile(profileData);

      // Construct the comprehensive registration object for the API
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
        // Move to the final success step instead of immediate redirection
        setActiveStep(3);
      }
    },
    [identification, certifications, otp, register]
  );

  /** Generic handler to return to the previous onboarding step */
  const handleBack = useCallback(() => {
    setActiveStep((prev) => {
      const nextStep = prev - 1;
      // If moving back to Step 1 (Identification), reset OTP state
      if (nextStep === 0) {
        setOtp("");
        setIsOtpVerified(false);
      }
      return nextStep;
    });
  }, []);

  return {
    activeStep,
    identification,
    certifications,
    setCertifications,
    profile,
    otp,
    isOtpVerified,
    registering,
    registrationError,
    isSuccessStep: activeStep === 3,
    handleStep1Submit,
    handleStep2Submit,
    handleFinalSubmit,
    handleBack,
  };
}
