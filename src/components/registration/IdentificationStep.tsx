import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { FormTextField } from "@/components/common";
import {
  identificationSchema,
  IdentificationFormData,
} from "@/schemas/registration";

interface IdentificationStepProps {
  defaultValues: Partial<IdentificationFormData>;
  onNext: (data: IdentificationFormData) => void;
}

export default function IdentificationStep({
  defaultValues,
  onNext,
}: IdentificationStepProps) {
  const { control, handleSubmit } = useForm<IdentificationFormData>({
    resolver: zodResolver(identificationSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      ...defaultValues,
    },
  });

  return (
    <Box component="form" onSubmit={handleSubmit(onNext)} noValidate>
      <Typography variant="h5" fontWeight={700} gutterBottom>
        User Identification
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3.5 }}>
        Please provide your primary identity information
      </Typography>

      <Stack spacing={3}>
        <FormTextField<IdentificationFormData>
          name="firstName"
          control={control}
          label="First Name"
          placeholder="Enter your first name"
          required
        />

        <FormTextField<IdentificationFormData>
          name="lastName"
          control={control}
          label="Last Name"
          placeholder="Enter your last name"
          required
        />

        <FormTextField<IdentificationFormData>
          name="email"
          control={control}
          label="Email Address"
          placeholder="your.email@example.com"
          type="email"
          required
        />
      </Stack>

      <Button
        type="submit"
        variant="contained"
        size="large"
        fullWidth
        sx={{ mt: 4, py: 1.4, fontSize: "1rem", fontWeight: 600 }}
      >
        Next
      </Button>
    </Box>
  );
}
