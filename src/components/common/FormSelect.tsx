import { Controller, Control, FieldValues, Path } from "react-hook-form";
import TextField, { TextFieldProps } from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export interface SelectOption {
  label: string;
  value: string;
}

type FormSelectProps<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  options: SelectOption[];
  label?: string;
  required?: boolean;
  placeholder?: string;
} & Omit<TextFieldProps, "name" | "select" | "label">;

export default function FormSelect<T extends FieldValues>({
  name,
  control,
  options,
  label,
  required,
  placeholder,
  ...textFieldProps
}: FormSelectProps<T>) {
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
            select
            id={textFieldProps.id ?? name}
            error={!!error || textFieldProps.error}
            helperText={error?.message ?? textFieldProps.helperText}
            fullWidth={textFieldProps.fullWidth ?? true}
          >
            {placeholder && (
              <MenuItem value="" disabled>
                {placeholder}
              </MenuItem>
            )}
            {options.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Box>
      )}
    />
  );
}

