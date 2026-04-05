import {
  FormCheckbox,
  FormSelect,
  LoadingButton,
} from "@/components/common";
import {
  AUDIT_SECTOR_MAPPING,
  AUDIT_SECTORS,
  CertificationFormData,
  JURISDICTIONS,
  ProfileFormData,
  profileSchema,
} from "@/schemas/registration";
import { zodResolver } from "@hookform/resolvers/zod";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditIcon from "@mui/icons-material/Edit";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Chip,
  FormControl,
  FormControlLabel,
  FormHelperText,
  IconButton,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import AddCertificationDialog from "./AddCertificationDialog";

interface ProfileStepProps {
  /** Form values previously entered to support 'Back' navigation */
  defaultValues: Partial<ProfileFormData>;
  /** External state management for certifications (since they are dynamic) */
  certifications: CertificationFormData[];
  /** Callback to update parent state when certifications are added/edited/removed */
  onCertificationsChange: (certs: CertificationFormData[]) => void;
  /** Final completion callback */
  onNext: (data: ProfileFormData) => void;
  /** Return to Step 1 (Verification) */
  onBack: () => void;
  /** Loading state for the final registration API call */
  loading?: boolean;
  /** Error message from the backend if registration fails */
  error?: string | null;
}

/**
 * Step 2: Auditor Profile Completion
 * Final step capturing professional specialization, regional jurisdictions,
 * and academic/professional certifications.
 */
export default function ProfileStep({
  defaultValues,
  certifications,
  onCertificationsChange,
  onNext,
  onBack,
  loading = false,
  error = null,
}: ProfileStepProps) {
  // Modal state for adding/editing professional credentials
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  // Main form setup for profile data
  const {
    control,
    handleSubmit,
    watch,
    setValue,
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

  // Watch the primary sector to provide dynamic sub-sector options
  const selectedSector = watch("primaryAuditSector");

  /** Dynamic computed list of sub-sectors based on current selection */
  const specializedAreaOptions = useMemo(() => {
    if (!selectedSector) return [];
    return AUDIT_SECTOR_MAPPING[selectedSector] || [];
  }, [selectedSector]);

  /** Reset specialized area when the primary domain changes to prevent invalid data */
  useEffect(() => {
    setValue("specializedAuditArea", "");
  }, [selectedSector, setValue]);

  // --- Certification Management Handlers ---

  const handleOpenAddDialog = () => {
    setEditingIndex(null);
    setDialogOpen(true);
  };

  const handleOpenEditDialog = (index: number) => {
    setEditingIndex(index);
    setDialogOpen(true);
  };

  /** Persist a certification (Add or Update) */
  const handleSaveCertification = (cert: CertificationFormData) => {
    if (editingIndex !== null) {
      const updated = [...certifications];
      updated[editingIndex] = cert;
      onCertificationsChange(updated);
    } else {
      onCertificationsChange([...certifications, cert]);
    }
  };

  const handleRemoveCertification = (index: number) => {
    onCertificationsChange(certifications.filter((_, i) => i !== index));
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onNext)} noValidate>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" fontWeight={800} gutterBottom sx={{ letterSpacing: "-0.02em" }}>
          Professional Profile
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Complement your account with your professional credentials and audit specialization area.
        </Typography>
      </Box>

      {/* Persistence Error Display */}
      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2.5 }}>
          {error}
        </Alert>
      )}

      {/* --- Section A: Professional Certifications --- */}
      <Paper
        variant="outlined"
        sx={{
          p: 3,
          mb: 4,
          borderRadius: 3,
          bgcolor: "grey.50",
          borderStyle: certifications.length > 0 ? "solid" : "dashed",
        }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: certifications.length > 0 ? 3 : 0 }}
        >
          <Typography variant="subtitle1" fontWeight={800}>
            Certifications
          </Typography>
          <Button
            variant="contained"
            size="small"
            startIcon={<AddIcon />}
            onClick={handleOpenAddDialog}
            disabled={loading}
            sx={{
              fontWeight: 700,
              textTransform: "none",
              borderRadius: 2,
              boxShadow: "none",
              px: 2,
            }}
          >
            Add Credential
          </Button>
        </Stack>

        {certifications.length === 0 ? (
          <Box sx={{ mt: 1.5, textAlign: "center", py: 2 }}>
            <Typography variant="body2" color="text.secondary" fontStyle="italic">
              No certifications declared yet.
            </Typography>
          </Box>
        ) : (
          <Stack spacing={2}>
            {certifications.map((cert, index) => (
              <Stack
                key={index}
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{
                  py: 1.5,
                  px: 2,
                  bgcolor: "#fff",
                  borderRadius: 2,
                  border: "1px solid",
                  borderColor: "grey.200",
                  "&:hover": { borderColor: "primary.light" },
                }}
              >
                <Stack spacing={0.5}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Chip
                      label={cert.type}
                      color="primary"
                      size="small"
                      sx={{ fontWeight: 800, borderRadius: 1 }}
                    />
                    <Typography variant="body2" fontWeight={700}>
                      {cert.licenseNumber}
                    </Typography>
                  </Stack>
                  <Typography variant="caption" color="text.secondary" fontWeight={500}>
                    Year: {cert.year}
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={0.5}>
                  <Tooltip title="Edit" arrow>
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => handleOpenEditDialog(index)}
                      disabled={loading}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Remove" arrow>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleRemoveCertification(index)}
                      disabled={loading}
                    >
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </Stack>
            ))}
          </Stack>
        )}
      </Paper>

      {/* Certification Modal */}
      <AddCertificationDialog
        open={dialogOpen}
        initialData={editingIndex !== null ? certifications[editingIndex] : null}
        onClose={() => setDialogOpen(false)}
        onSave={handleSaveCertification}
      />

      <Stack spacing={4}>
        {/* --- Section B: Audit Specialization --- */}
        <Stack spacing={2.5}>
          <FormSelect<ProfileFormData>
            name="primaryAuditSector"
            control={control}
            label="Primary Audit Domain"
            required
            options={AUDIT_SECTORS}
            placeholder="e.g. Financial Services"
            disabled={loading}
          />

          <FormSelect<ProfileFormData>
            name="specializedAuditArea"
            control={control}
            label="Specialized Sub-sector"
            required
            options={specializedAreaOptions}
            disabled={!selectedSector || loading}
            placeholder={
              !selectedSector ? "Select domain first" : "Choose specialization"
            }
          />
        </Stack>

        {/* --- Section C: Multi-select Regional Jurisdictions --- */}
        <Controller
          name="jurisdictions"
          control={control}
          render={({ field }) => (
            <FormControl error={!!errors.jurisdictions} component="fieldset" disabled={loading}>
              <Typography variant="body2" fontWeight={800} sx={{ mb: 2 }}>
                Regional Jurisdictions *
              </Typography>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                  gap: 1.5,
                }}
              >
                {JURISDICTIONS.map((j) => {
                  const isChecked = field.value?.includes(j.value) ?? false;
                  return (
                    <FormControlLabel
                      key={j.value}
                      control={
                        <Checkbox
                          checked={isChecked}
                          onChange={(e) => {
                            const val = field.value ?? [];
                            if (e.target.checked) {
                              field.onChange([...val, j.value]);
                            } else {
                              field.onChange(val.filter((v: string) => v !== j.value));
                            }
                          }}
                          size="small"
                        />
                      }
                      label={
                        <Typography variant="body2" fontWeight={isChecked ? 700 : 400}>
                          {j.label}
                        </Typography>
                      }
                      sx={{
                        border: "1px solid",
                        borderColor: isChecked ? "primary.main" : "grey.200",
                        borderRadius: 2.5,
                        px: 1.5,
                        py: 0.5,
                        m: 0,
                        bgcolor: isChecked ? "primary.50" : "#fff",
                        "&:hover": { borderColor: "primary.main" },
                      }}
                    />
                  );
                })}
              </Box>
              {errors.jurisdictions && (
                <FormHelperText error sx={{ mx: 0, mt: 1, fontWeight: 500 }}>
                  {errors.jurisdictions.message}
                </FormHelperText>
              )}
            </FormControl>
          )}
        />

        {/* --- Section D: Compliance & Ethics Declaration --- */}
        <Paper
          variant="outlined"
          sx={{
            p: 3,
            borderRadius: 3.5,
            bgcolor: errors.independenceDeclaration ? "error.50" : "grey.50",
            borderColor: errors.independenceDeclaration ? "error.main" : "grey.200",
            transition: "all 0.3s ease",
          }}
        >
          <FormCheckbox<ProfileFormData>
            name="independenceDeclaration"
            control={control}
            disabled={loading}
            label={
              <Box sx={{ ml: 1.5 }}>
                <Typography variant="body2" fontWeight={800}>
                  Independence & Ethics Declaration *
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ lineHeight: 1.6, display: "block", mt: 1, fontWeight: 500 }}
                >
                  By checking this box, I confirm I maintain full independence and
                  have no conflicts of interest as per IESBA and local standards.
                </Typography>
              </Box>
            }
          />
        </Paper>
      </Stack>

      {/* Progress Actions */}
      <Stack direction={{ xs: "column-reverse", sm: "row" }} spacing={2} sx={{ mt: 6 }}>
        <Button
          variant="outlined"
          size="large"
          fullWidth
          onClick={onBack}
          disabled={loading}
          sx={{ py: 1.6, fontSize: "0.95rem", fontWeight: 700, borderRadius: 2.5 }}
        >
          Previous Step
        </Button>
        <LoadingButton
          type="submit"
          variant="contained"
          size="large"
          fullWidth
          loading={loading}
          loadingText="Finalizing Account…"
          sx={{ py: 1.6, fontSize: "0.95rem", fontWeight: 800, borderRadius: 2.5 }}
        >
          Complete Auditor Profile
        </LoadingButton>
      </Stack>
    </Box>
  );
}



