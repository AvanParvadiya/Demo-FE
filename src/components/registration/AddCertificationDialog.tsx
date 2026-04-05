import {
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
import { useForm } from "react-hook-form";
import { FormTextField } from "@/components/common";

interface AddCertificationDialogProps {
  open: boolean;
  onClose: () => void;
  onAdd: (certification: CertificationFormData) => void;
}

export default function AddCertificationDialog({
  open,
  onClose,
  onAdd,
}: AddCertificationDialogProps) {
  const { control, handleSubmit, reset } = useForm<CertificationFormData>({
    resolver: zodResolver(certificationSchema),
    defaultValues: { name: "", issuingBody: "", year: "" },
  });

  const onSubmit = (data: CertificationFormData) => {
    onAdd(data);
    reset();
    onClose();
  };

  const handleClose = () => {
    reset();
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
        Add Certification
      </DialogTitle>

      <DialogContent>
        <Stack spacing={2.5} sx={{ mt: 1 }}>
          <FormTextField<CertificationFormData>
            name="name"
            control={control}
            id="certName"
            label="Certification Name"
            placeholder="e.g. CPA, CA, ACCA"
            required
          />

          <FormTextField<CertificationFormData>
            name="issuingBody"
            control={control}
            id="certIssuingBody"
            label="Issuing Body"
            placeholder="e.g. AICPA, ICAI"
            required
          />

          <FormTextField<CertificationFormData>
            name="year"
            control={control}
            id="certYear"
            label="Year Obtained"
            placeholder="e.g. 2023"
            required
          />
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button onClick={handleClose} variant="outlined">
          Cancel
        </Button>
        <Button onClick={handleSubmit(onSubmit)} variant="contained">
          Add Certification
        </Button>
      </DialogActions>
    </Dialog>
  );
}
