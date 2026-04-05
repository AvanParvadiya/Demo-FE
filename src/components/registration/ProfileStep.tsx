import { FormCheckbox, FormSelect, LoadingButton } from "@/components/common";
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
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import Chip from "@mui/material/Chip";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormHelperText from "@mui/material/FormHelperText";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import AddCertificationDialog from "./AddCertificationDialog";

interface ProfileStepProps {
  defaultValues: Partial<ProfileFormData>;
  certifications: CertificationFormData[];
  onCertificationsChange: (certs: CertificationFormData[]) => void;
  onNext: (data: ProfileFormData) => void;
  onBack: () => void;
  loading?: boolean;
  error?: string | null;
}

export default function ProfileStep({
  defaultValues,
  certifications,
  onCertificationsChange,
  onNext,
  onBack,
  loading = false,
  error = null,
}: ProfileStepProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

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

  const selectedSector = watch("primaryAuditSector");

  // Get sub-sectors based on selected primary sector
  const specializedAreaOptions = useMemo(() => {
    if (!selectedSector) return [];
    return AUDIT_SECTOR_MAPPING[selectedSector] || [];
  }, [selectedSector]);

  // Reset specialized area when sector changes
  useEffect(() => {
    setValue("specializedAuditArea", "");
  }, [selectedSector, setValue]);

  const handleOpenAddDialog = () => {
    setEditingIndex(null);
    setDialogOpen(true);
  };

  const handleOpenEditDialog = (index: number) => {
    setEditingIndex(index);
    setDialogOpen(true);
  };

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
      <Typography variant="h5" fontWeight={700} gutterBottom>
        Auditor Profile Completion
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3.5 }}>
        Please provide your professional audit specialization and credentials
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      {/* --- A. Professional Certifications --- */}
      <Paper
        variant="outlined"
        sx={{
          p: 2.5,
          mb: 3.5,
          borderRadius: 3,
        }}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "stretch", sm: "center" }}
          spacing={2}
          sx={{ mb: 2 }}
        >
          <Box>
            <Typography variant="body1" fontWeight={700}>
              Professional Certifications
            </Typography>
          </Box>
          <Button
            variant="contained"
            size="small"
            startIcon={<AddIcon />}
            onClick={handleOpenAddDialog}
            disabled={loading}
            sx={{
              textTransform: "none",
              borderRadius: 2,
              px: { xs: 1.5, sm: 2 },
              py: { xs: 1, sm: 0.5 },
              boxShadow: "none",
              "&:hover": { boxShadow: "none" },
              width: { xs: "100%", sm: "auto" },
            }}
          >
            Add Certification
          </Button>
        </Stack>

        {certifications.length === 0 ? (
          <Box
            sx={{
              borderRadius: 2,
              bgcolor: "#fff",
            }}
          >
            <Typography variant="body2" color="text.secondary">
              No certifications added yet.
            </Typography>
          </Box>
        ) : (
          <Stack spacing={1.5}>
            {certifications.map((cert, index) => (
              <Stack
                key={index}
                direction={{ xs: "column", sm: "row" }}
                alignItems={{ xs: "flex-start", sm: "center" }}
                justifyContent="space-between"
                spacing={2}
                sx={{
                  py: 1.5,
                  px: 2,
                  bgcolor: "#fff",
                  borderRadius: 2,
                  border: "1px solid",
                  borderColor: "grey.200",
                }}
              >
                <Stack spacing={0.5} sx={{ width: "100%" }}>
                  <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                    <Chip
                      label={cert.type}
                      color="primary"
                      size="small"
                      sx={{ fontWeight: 700, borderRadius: 1 }}
                    />
                    <Typography variant="body2" fontWeight={600}>
                      License: {cert.licenseNumber}
                    </Typography>
                  </Stack>
                  <Typography variant="caption" color="text.secondary">
                    Qualified in {cert.year}
                  </Typography>
                </Stack>
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{
                    width: { xs: "100%", sm: "auto" },
                    justifyContent: { xs: "flex-end", sm: "flex-start" },
                    borderTop: { xs: "1px solid", sm: "none" },
                    borderColor: "grey.100",
                    pt: { xs: 1, sm: 0 },
                  }}
                >
                  <Tooltip title="Edit Certification" arrow>
                    <IconButton
                      size="small"
                      color="primary"
                      disabled={loading}
                      onClick={() => handleOpenEditDialog(index)}
                      sx={{ bgcolor: "primary.50", "&:hover": { bgcolor: "primary.100" } }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete Certification" arrow>
                    <IconButton
                      size="small"
                      color="error"
                      disabled={loading}
                      onClick={() => handleRemoveCertification(index)}
                      sx={{ bgcolor: "error.50", "&:hover": { bgcolor: "error.100" } }}
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

      <AddCertificationDialog
        open={dialogOpen}
        initialData={editingIndex !== null ? certifications[editingIndex] : null}
        onClose={() => setDialogOpen(false)}
        onSave={handleSaveCertification}
      />

      <Stack spacing={3.5}>
        {/* --- B. Audit Specialization --- */}
        <Stack spacing={2}>
          <FormSelect<ProfileFormData>
            name="primaryAuditSector"
            control={control}
            label="Primary Audit Sector"
            required
            options={AUDIT_SECTORS}
            placeholder="Select primary sector"
            disabled={loading}
          />

          <FormSelect<ProfileFormData>
            name="specializedAuditArea"
            control={control}
            label="Specialized Audit Area"
            required
            options={specializedAreaOptions}
            disabled={!selectedSector || loading}
            placeholder={
              !selectedSector
                ? "Select a sector first"
                : "Select specialization"
            }
          />
        </Stack>

        {/* --- Multi-select Jurisdiction --- */}
        <Controller
          name="jurisdictions"
          control={control}
          render={({ field }) => (
            <FormControl error={!!errors.jurisdictions} component="fieldset" disabled={loading}>
              <Typography variant="body2" fontWeight={600} sx={{ mb: 1.5 }}>
                Jurisdiction (Select regional standards) *
              </Typography>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: "repeat(2, 1fr)",
                  },
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
                        <Typography variant="body2" fontWeight={isChecked ? 600 : 400}>
                          {j.label}
                        </Typography>
                      }
                      sx={{
                        border: "1px solid",
                        borderColor: isChecked ? "primary.main" : "grey.200",
                        borderRadius: 2,
                        px: 1.5,
                        py: 0.5,
                        m: 0,
                        transition: "all 0.2s",
                        bgcolor: isChecked ? "primary.50" : "#fff",
                        "&:hover": {
                          borderColor: isChecked ? "primary.main" : "grey.400",
                          bgcolor: isChecked ? "primary.50" : "grey.50",
                        },
                      }}
                    />
                  );
                })}
              </Box>
              {errors.jurisdictions && (
                <FormHelperText sx={{ mx: 0, mt: 1 }}>
                  {errors.jurisdictions.message}
                </FormHelperText>
              )}
            </FormControl>
          )}
        />

        {/* --- Independence Declaration --- */}
        <Paper
          variant="outlined"
          sx={{
            p: 2.5,
            borderRadius: 3,
            bgcolor: errors.independenceDeclaration ? "error.50" : "#fff",
            borderColor: errors.independenceDeclaration
              ? "error.main"
              : "grey.200",
            transition: "all 0.2s",
          }}
        >
          <FormCheckbox<ProfileFormData>
            name="independenceDeclaration"
            control={control}
            disabled={loading}
            label={
              <Box sx={{ ml: 1 }}>
                <Typography variant="body2" fontWeight={700}>
                  Independence Declaration *
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ lineHeight: 1.6, display: "block", mt: 0.5 }}
                >
                  I hereby confirm that I have no conflicts of interest and will
                  maintain strict independence in accordance with professional
                  auditing standards (e.g., IESBA Code of Ethics).
                </Typography>
              </Box>
            }
          />
        </Paper>
      </Stack>

      <Stack direction={{ xs: "column-reverse", sm: "row" }} spacing={2} sx={{ mt: 5 }}>
        <Button
          variant="outlined"
          size="large"
          fullWidth
          onClick={onBack}
          disabled={loading}
          sx={{
            py: 1.6,
            fontSize: "1rem",
            fontWeight: 700,
            borderRadius: 2,
            borderWidth: 2,
            "&:hover": { borderWidth: 2 },
          }}
        >
          Back
        </Button>
        <LoadingButton
          type="submit"
          variant="contained"
          color="primary"
          size="large"
          fullWidth
          loading={loading}
          loadingText="Finalizing Registration…"
          sx={{
            py: 1.6,
            fontSize: "1rem",
            fontWeight: 700,
            borderRadius: 2,
            boxShadow: "none",
            "&:hover": { boxShadow: "none" },
          }}
        >
          Complete Registration
        </LoadingButton>
      </Stack>

    </Box>
  );
}


