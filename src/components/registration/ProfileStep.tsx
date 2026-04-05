import {
  AUDIT_SECTORS,
  CertificationFormData,
  JURISDICTIONS,
  ProfileFormData,
  profileSchema,
  SPECIALIZED_AREAS,
} from "@/schemas/registration";
import { zodResolver } from "@hookform/resolvers/zod";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import Chip from "@mui/material/Chip";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormHelperText from "@mui/material/FormHelperText";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import AddCertificationDialog from "./AddCertificationDialog";

interface ProfileStepProps {
  defaultValues: Partial<ProfileFormData>;
  certifications: CertificationFormData[];
  onCertificationsChange: (certs: CertificationFormData[]) => void;
  onNext: (data: ProfileFormData) => void;
  onBack: () => void;
}

export default function ProfileStep({
  defaultValues,
  certifications,
  onCertificationsChange,
  onNext,
  onBack,
}: ProfileStepProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      primaryAuditSector: "",
      specializedAuditArea: "",
      jurisdictions: [],
      independenceDeclaration: false as unknown as true,
      ...defaultValues,
    },
  });

  const handleAddCertification = (cert: CertificationFormData) => {
    onCertificationsChange([...certifications, cert]);
  };

  const handleRemoveCertification = (index: number) => {
    onCertificationsChange(certifications.filter((_, i) => i !== index));
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onNext)} noValidate>
      <Typography variant="h5" fontWeight={700} gutterBottom>
        Auditor Profile Completion
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3.5 }}>
        Please provide your professional audit credentials
      </Typography>

      {/* --- Certifications --- */}
      <Paper
        variant="outlined"
        sx={{
          p: 2.5,
          mb: 3,
          borderRadius: 2,
          borderColor: "grey.300",
        }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 1.5 }}
        >
          <Typography fontWeight={600}>Professional Certifications</Typography>
          <Button
            variant="contained"
            size="small"
            startIcon={<AddIcon />}
            onClick={() => setDialogOpen(true)}
            sx={{ textTransform: "none" }}
          >
            Add Certification
          </Button>
        </Stack>

        {certifications.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No certifications added yet
          </Typography>
        ) : (
          <Stack spacing={1}>
            {certifications.map((cert, index) => (
              <Stack
                key={index}
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{
                  py: 1,
                  px: 1.5,
                  bgcolor: "grey.50",
                  borderRadius: 1.5,
                }}
              >
                <Stack direction="row" spacing={1} alignItems="center">
                  <Chip
                    label={cert.name}
                    color="primary"
                    size="small"
                    variant="outlined"
                  />
                  <Typography variant="body2" color="text.secondary">
                    {cert.issuingBody} &middot; {cert.year}
                  </Typography>
                </Stack>
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => handleRemoveCertification(index)}
                  aria-label={`Remove ${cert.name}`}
                >
                  <DeleteOutlineIcon fontSize="small" />
                </IconButton>
              </Stack>
            ))}
          </Stack>
        )}
      </Paper>

      <AddCertificationDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onAdd={handleAddCertification}
      />

      <Stack spacing={3}>
        {/* --- Primary Audit Sector --- */}
        <Controller
          name="primaryAuditSector"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              id="primaryAuditSector"
              select
              label="Primary Audit Sector"
              required
              fullWidth
              error={!!errors.primaryAuditSector}
              helperText={errors.primaryAuditSector?.message}
            >
              <MenuItem value="" disabled>
                Select sector
              </MenuItem>
              {AUDIT_SECTORS.map((sector) => (
                <MenuItem key={sector} value={sector}>
                  {sector}
                </MenuItem>
              ))}
            </TextField>
          )}
        />

        {/* --- Specialized Audit Area --- */}
        <Controller
          name="specializedAuditArea"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              id="specializedAuditArea"
              select
              label="Specialized Audit Area"
              fullWidth
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {SPECIALIZED_AREAS.map((area) => (
                <MenuItem key={area} value={area}>
                  {area}
                </MenuItem>
              ))}
            </TextField>
          )}
        />

        {/* --- Jurisdictions --- */}
        <Controller
          name="jurisdictions"
          control={control}
          render={({ field }) => (
            <FormControl error={!!errors.jurisdictions} component="fieldset">
              <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>
                Jurisdiction (Select all that apply) *
              </Typography>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                  gap: 0.5,
                }}
              >
                {JURISDICTIONS.map((j) => (
                  <FormControlLabel
                    key={j.value}
                    control={
                      <Checkbox
                        checked={field.value?.includes(j.value) ?? false}
                        onChange={(e) => {
                          const current = field.value ?? [];
                          if (e.target.checked) {
                            field.onChange([...current, j.value]);
                          } else {
                            field.onChange(
                              current.filter((v: string) => v !== j.value)
                            );
                          }
                        }}
                        size="small"
                      />
                    }
                    label={
                      <Typography variant="body2">{j.label}</Typography>
                    }
                    sx={{
                      border: "1px solid",
                      borderColor: field.value?.includes(j.value)
                        ? "primary.main"
                        : "grey.300",
                      borderRadius: 1.5,
                      px: 1,
                      py: 0.2,
                      m: 0,
                      transition: "border-color 0.2s",
                      bgcolor: field.value?.includes(j.value)
                        ? "primary.50"
                        : "transparent",
                    }}
                  />
                ))}
              </Box>
              {errors.jurisdictions && (
                <FormHelperText>{errors.jurisdictions.message}</FormHelperText>
              )}
            </FormControl>
          )}
        />

        {/* --- Independence Declaration --- */}
        <Controller
          name="independenceDeclaration"
          control={control}
          render={({ field }) => (
            <FormControl error={!!errors.independenceDeclaration}>
              <Paper
                variant="outlined"
                sx={{
                  p: 2,
                  borderRadius: 2,
                  borderColor: errors.independenceDeclaration
                    ? "error.main"
                    : "grey.300",
                }}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={!!field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                    />
                  }
                  label={
                    <Box>
                      <Typography variant="body2" fontWeight={600}>
                        Independence Declaration *
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ lineHeight: 1.5 }}
                      >
                        I hereby confirm that I have no conflicts of interest
                        and will maintain independence in accordance with
                        professional auditing standards.
                      </Typography>
                    </Box>
                  }
                  sx={{ alignItems: "flex-start", m: 0 }}
                />
              </Paper>
              {errors.independenceDeclaration && (
                <FormHelperText>
                  {errors.independenceDeclaration.message}
                </FormHelperText>
              )}
            </FormControl>
          )}
        />
      </Stack>

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
          color="primary"
          size="large"
          fullWidth
          sx={{ py: 1.4, fontSize: "1rem", fontWeight: 600 }}
        >
          Complete Registration
        </Button>
      </Stack>
    </Box>
  );
}
