import { FormTextField, LoadingButton } from "@/components/common";
import { useApiMutation } from "@/hooks";
import { API_ENDPOINTS } from "@/lib";
import {
  IdentificationFormData,
  identificationSchema,
} from "@/schemas/registration";
import { zodResolver } from "@hookform/resolvers/zod";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useForm } from "react-hook-form";

/**
 * API Response for the send-otp endpoint
 */
interface SendOtpResponse {
  message: string;
  otp: string;
  expiresInSeconds: number;
}

interface IdentificationStepProps {
  /** Previously entered values for form persistence */
  defaultValues: Partial<IdentificationFormData>;
  /** Callback triggering move to Step 1 (Verification) */
  onNext: (data: IdentificationFormData, otpCode: string) => void;
}

/**
 * Step 0: Identification
 * Captures basic auditor details (name, email) and triggers the registration OTP.
 */
export default function IdentificationStep({
  defaultValues,
  onNext,
}: IdentificationStepProps) {
  // Use specialized hook for the API call to generate/send the OTP
  const { mutate: sendOtp, loading, error } = useApiMutation<
    { email: string },
    SendOtpResponse
  >("post", API_ENDPOINTS.OTP.SEND);

  // Initialize form with local persistence and validation
  const { control, handleSubmit } = useForm<IdentificationFormData>({
    resolver: zodResolver(identificationSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      ...defaultValues,
    },
  });

  /**
   * Form Submission Handler
   * Requests an OTP from the backend before proceeding to verification.
   */
  const onSubmit = async (data: IdentificationFormData) => {
    const result = await sendOtp({ email: data.email });
    if (result) {
      // Pass the captured data and the received OTP (for simulation) to the orchestrator
      onNext(data, result.otp);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" fontWeight={700} gutterBottom>
          User Identification
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Please provide your primary identity information to begin registration.
        </Typography>
      </Box>

      {/* Global API Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      {/* Input Fields Stack */}
      <Stack spacing={3}>
        <FormTextField<IdentificationFormData>
          name="firstName"
          control={control}
          label="First Name"
          placeholder="Enter your first name"
          required
          disabled={loading}
        />

        <FormTextField<IdentificationFormData>
          name="lastName"
          control={control}
          label="Last Name"
          placeholder="Enter your last name"
          required
          disabled={loading}
        />

        <FormTextField<IdentificationFormData>
          name="email"
          control={control}
          label="Email Address"
          placeholder="your.email@example.com"
          type="email"
          required
          disabled={loading}
        />
      </Stack>

      <LoadingButton
        type="submit"
        variant="contained"
        size="large"
        fullWidth
        loading={loading}
        loadingText="Generating Identity OTP…"
        sx={{ mt: 5, py: 1.4, fontSize: "1rem", fontWeight: 700, borderRadius: 2.5 }}
      >
        Continue to Verification
      </LoadingButton>
    </Box>
  );
}

