import { useState, useEffect, useCallback, ChangeEvent } from "react";
import TextField, { TextFieldProps } from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";

interface SearchInputProps
  extends Omit<TextFieldProps, "onChange" | "value"> {
  value?: string;
  onSearch: (value: string) => void;
  /** Debounce delay in ms (default: 300) */
  debounceMs?: number;
}

export default function SearchInput({
  value: controlledValue,
  onSearch,
  debounceMs = 300,
  placeholder = "Search…",
  ...rest
}: SearchInputProps) {
  const [internalValue, setInternalValue] = useState(controlledValue ?? "");

  // Sync external controlled value
  useEffect(() => {
    if (controlledValue !== undefined) {
      setInternalValue(controlledValue);
    }
  }, [controlledValue]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(internalValue);
    }, debounceMs);
    return () => clearTimeout(timer);
  }, [internalValue, debounceMs, onSearch]);

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setInternalValue(e.target.value);
  }, []);

  const handleClear = useCallback(() => {
    setInternalValue("");
    onSearch("");
  }, [onSearch]);

  return (
    <TextField
      {...rest}
      value={internalValue}
      onChange={handleChange}
      placeholder={placeholder}
      size={rest.size ?? "small"}
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: "text.secondary", fontSize: 20 }} />
            </InputAdornment>
          ),
          endAdornment: internalValue ? (
            <InputAdornment position="end">
              <IconButton size="small" onClick={handleClear} edge="end">
                <ClearIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </InputAdornment>
          ) : undefined,
        },
      }}
      sx={{
        minWidth: { xs: "100%", sm: 280 },
        ...rest.sx,
      }}
    />
  );
}
