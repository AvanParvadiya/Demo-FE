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

interface SendOtpResponse {
  message: string;
  otp: string;
  expiresInSeconds: number;
}

interface IdentificationStepProps {
  defaultValues: Partial<IdentificationFormData>;
  onNext: (data: IdentificationFormData, otpCode: string) => void;
}

export default function IdentificationStep({
  defaultValues,
  onNext,
}: IdentificationStepProps) {
  const { mutate: sendOtp, loading, error } = useApiMutation<
    { email: string },
    SendOtpResponse
  >("post", API_ENDPOINTS.OTP.SEND);

  const { control, handleSubmit } = useForm<IdentificationFormData>({
    resolver: zodResolver(identificationSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      ...defaultValues,
    },
  });

  const onSubmit = async (data: IdentificationFormData) => {
    const result = await sendOtp({ email: data.email });
    if (result) {
      onNext(data, result.otp);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <Typography variant="h5" fontWeight={700} gutterBottom>
        User Identification
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3.5 }}>
        Please provide your primary identity information
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

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
        loadingText="Sending OTP…"
        sx={{ mt: 4, py: 1.4, fontSize: "1rem", fontWeight: 600 }}
      >
        Next
      </LoadingButton>
    </Box>
  );
}
