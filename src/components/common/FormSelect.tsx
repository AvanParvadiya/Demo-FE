import { Controller, Control, FieldValues, Path } from "react-hook-form";
import TextField, { TextFieldProps } from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";

export interface SelectOption {
  label: string;
  value: string;
}

type FormSelectProps<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  options: SelectOption[];
  placeholder?: string;
} & Omit<TextFieldProps, "name" | "select">;

export default function FormSelect<T extends FieldValues>({
  name,
  control,
  options,
  placeholder,
  ...textFieldProps
}: FormSelectProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
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
      )}
    />
  );
}
