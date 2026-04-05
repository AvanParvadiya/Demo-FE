import { Controller, Control, FieldValues, Path } from "react-hook-form";
import TextField, { TextFieldProps } from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

type FormTextFieldProps<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  required?: boolean;
} & Omit<TextFieldProps, "name" | "label">;

export default function FormTextField<T extends FieldValues>({
  name,
  control,
  label,
  required,
  ...textFieldProps
}: FormTextFieldProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Box>
          {label && (
            <Typography
              component="label"
              htmlFor={textFieldProps.id ?? name}
              variant="body2"
              fontWeight={600}
              sx={{ display: "block", mb: 0.8, color: "text.primary" }}
            >
              {label} {required && <span style={{ color: "#ef4444" }}>*</span>}
            </Typography>
          )}
          <TextField
            {...field}
            {...textFieldProps}
            id={textFieldProps.id ?? name}
            error={!!error || textFieldProps.error}
            helperText={error?.message ?? textFieldProps.helperText}
            fullWidth={textFieldProps.fullWidth ?? true}
          />


        </Box>
      )}
    />
  );
}
