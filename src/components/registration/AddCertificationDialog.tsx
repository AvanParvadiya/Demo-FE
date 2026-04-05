import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import {
  certificationSchema,
  CertificationFormData,
} from "@/schemas/registration";

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
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CertificationFormData>({
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
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                id="certName"
                label="Certification Name"
                placeholder="e.g. CPA, CA, ACCA"
                fullWidth
                required
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            )}
          />

          <Controller
            name="issuingBody"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                id="certIssuingBody"
                label="Issuing Body"
                placeholder="e.g. AICPA, ICAI"
                fullWidth
                required
                error={!!errors.issuingBody}
                helperText={errors.issuingBody?.message}
              />
            )}
          />

          <Controller
            name="year"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                id="certYear"
                label="Year Obtained"
                placeholder="e.g. 2023"
                fullWidth
                required
                error={!!errors.year}
                helperText={errors.year?.message}
              />
            )}
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
