import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
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
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<IdentificationFormData>({
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
        <Controller
          name="firstName"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              id="firstName"
              label="First Name"
              placeholder="Enter your first name"
              required
              fullWidth
              error={!!errors.firstName}
              helperText={errors.firstName?.message}
            />
          )}
        />

        <Controller
          name="lastName"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              id="lastName"
              label="Last Name"
              placeholder="Enter your last name"
              required
              fullWidth
              error={!!errors.lastName}
              helperText={errors.lastName?.message}
            />
          )}
        />

        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              id="email"
              label="Email Address"
              placeholder="your.email@example.com"
              type="email"
              required
              fullWidth
              error={!!errors.email}
              helperText={errors.email?.message}
            />
          )}
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
