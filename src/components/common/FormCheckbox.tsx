import { Controller, Control, FieldValues, Path } from "react-hook-form";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox, { CheckboxProps } from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import { ReactNode } from "react";

type FormCheckboxProps<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  label: ReactNode;
} & Omit<CheckboxProps, "name">;

export default function FormCheckbox<T extends FieldValues>({
  name,
  control,
  label,
  ...checkboxProps
}: FormCheckboxProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <FormControl error={!!error}>
          <FormControlLabel
            control={
              <Checkbox
                {...checkboxProps}
                checked={!!field.value}
                onChange={(e) => field.onChange(e.target.checked)}
              />
            }
            label={label}
          />
          {error && <FormHelperText>{error.message}</FormHelperText>}
        </FormControl>
      )}
    />
  );
}
