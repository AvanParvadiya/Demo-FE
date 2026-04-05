import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";
import { FormTextField, LoadingButton } from "@/components/common";
import {
  identificationSchema,
  IdentificationFormData,
} from "@/schemas/registration";
import { apiClient } from "@/lib";
import { getErrorMessage } from "@/lib/apiTypes";

interface IdentificationStepProps {
  defaultValues: Partial<IdentificationFormData>;
  onNext: (data: IdentificationFormData, otpCode: string) => void;
}

export default function IdentificationStep({
  defaultValues,
  onNext,
}: IdentificationStepProps) {
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

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
    setLoading(true);
    setApiError("");
    try {
      const response = await apiClient.post("http://localhost:3001/v0/otp/send", {
        email: data.email,
      });
      // Pass the OTP code (for testing display on Step 2)
      onNext(data, response.data.otp);
    } catch (err) {
      setApiError(getErrorMessage(err));
    } finally {
      setLoading(false);
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

      {apiError && (
        <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
          {apiError}
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
