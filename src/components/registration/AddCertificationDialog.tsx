import { FormSelect, FormTextField } from "@/components/common";
import {
  CERTIFICATION_TYPES,
  CertificationFormData,
  certificationSchema,
} from "@/schemas/registration";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
} from "@mui/material";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

interface AddCertificationDialogProps {
  /** Visibility state controlled by the parent ProfileStep */
  open: boolean;
  /** Callback to close the modal without saving */
  onClose: () => void;
  /** Callback to persist the certification data */
  onSave: (certification: CertificationFormData) => void;
  /** Populated when editing an existing credential; null for new additions */
  initialData?: CertificationFormData | null;
}

/**
 * Modal Dialog for declaring Professional Certifications (e.g., CA, ACCA).
 * Supports both creation and editing of existing credentials.
 */
export default function AddCertificationDialog({
  open,
  onClose,
  onSave,
  initialData,
}: AddCertificationDialogProps) {
  const isEditing = !!initialData;

  // Initialize form with local persistence and validation
  const { control, handleSubmit, reset } = useForm<CertificationFormData>({
    resolver: zodResolver(certificationSchema),
    defaultValues: { type: "", licenseNumber: "", year: "" },
  });

  /**
   * Sync form state with initialData whenever the dialog opens.
   * This ensures the form is either 'fresh' for new adds or 'pre-filled' for edits.
   */
  useEffect(() => {
    if (open) {
      if (initialData) {
        reset(initialData);
      } else {
        reset({ type: "", licenseNumber: "", year: "" });
      }
    }
  }, [open, initialData, reset]);

  /** 
   * Internal submit handler
   * Passes the validated data to the parent and closes the dialog.
   */
  const onFormSubmit = (data: CertificationFormData) => {
    onSave(data);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3.5,
          p: 1,
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: 800, fontSize: "1.35rem", letterSpacing: "-0.02em" }}>
        {isEditing ? "Update Credential" : "Add Professional Credential"}
      </DialogTitle>

      <DialogContent>
        <Stack spacing={3} sx={{ mt: 1.5 }}>
          {/* Certification Type (CA, ACCA, etc.) */}
          <FormSelect<CertificationFormData>
            name="type"
            control={control}
            id="cert-type-select"
            label="Credential Type"
            options={CERTIFICATION_TYPES}
            required
            placeholder="Select qualification type"
          />

          {/* Official License/Registration Number */}
          <FormTextField<CertificationFormData>
            name="licenseNumber"
            control={control}
            id="cert-license-input"
            label="License / Registration Number"
            placeholder="e.g. REG-449201"
            required
          />

          {/* Qualification Year (Validated as realistic in Zod schema) */}
          <FormTextField<CertificationFormData>
            name="year"
            control={control}
            id="cert-year-input"
            label="Year of Qualification"
            placeholder="e.g. 2021"
            type="number"
            required
          />
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3.5, pt: 2 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{ fontWeight: 700, borderRadius: 2.5, px: 3 }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit(onFormSubmit)}
          variant="contained"
          sx={{ fontWeight: 800, borderRadius: 2.5, px: 4 }}
        >
          {isEditing ? "Save Changes" : "Save Credential"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}



