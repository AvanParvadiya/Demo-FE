import { Controller, Control, FieldValues, Path } from "react-hook-form";
import TextField, { TextFieldProps } from "@mui/material/TextField";

type FormTextFieldProps<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
} & Omit<TextFieldProps, "name">;

export default function FormTextField<T extends FieldValues>({
  name,
  control,
  ...textFieldProps
}: FormTextFieldProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          {...textFieldProps}
          id={textFieldProps.id ?? name}
          error={!!error || textFieldProps.error}
          helperText={error?.message ?? textFieldProps.helperText}
          fullWidth={textFieldProps.fullWidth ?? true}
        />
      )}
    />
  );
}
