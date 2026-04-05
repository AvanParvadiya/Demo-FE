import { FormSelect, FormTextField } from "@/components/common";
import {
  CERTIFICATION_TYPES,
  CertificationFormData,
  certificationSchema,
} from "@/schemas/registration";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Stack from "@mui/material/Stack";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

interface AddCertificationDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (certification: CertificationFormData) => void;
  initialData?: CertificationFormData | null;
}

export default function AddCertificationDialog({
  open,
  onClose,
  onSave,
  initialData,
}: AddCertificationDialogProps) {
  const isEditing = !!initialData;

  const { control, handleSubmit, reset } = useForm<CertificationFormData>({
    resolver: zodResolver(certificationSchema),
    defaultValues: { type: "", licenseNumber: "", year: "" },
  });

  // Sync initialData with the form when the dialog opens
  useEffect(() => {
    if (open) {
      if (initialData) {
        reset(initialData);
      } else {
        reset({ type: "", licenseNumber: "", year: "" });
      }
    }
  }, [open, initialData, reset]);

  const onFormSubmit = (data: CertificationFormData) => {
    onSave(data);
    onClose();
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { borderRadius: 3 } }}
    >
      <DialogTitle sx={{ fontWeight: 700, fontSize: "1.2rem" }}>
        {isEditing ? "Edit Certification" : "Add Certification"}
      </DialogTitle>

      <DialogContent>
        <Stack spacing={2.5} sx={{ mt: 1 }}>
          <FormSelect<CertificationFormData>
            name="type"
            control={control}
            id="certType"
            label="Certification Type"
            options={CERTIFICATION_TYPES}
            required
          />

          <FormTextField<CertificationFormData>
            name="licenseNumber"
            control={control}
            id="certLicenseNumber"
            label="License Number"
            placeholder="Enter your license number"
            required
          />

          <FormTextField<CertificationFormData>
            name="year"
            control={control}
            id="certYear"
            label="Year of Qualification"
            placeholder="e.g. 2023"
            type="number"
            required
          />
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button onClick={handleClose} variant="outlined">
          Cancel
        </Button>
        <Button onClick={handleSubmit(onFormSubmit)} variant="contained">
          {isEditing ? "Update Certification" : "Add Certification"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}


