import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { ChangeEvent } from "react";

interface OtpInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: boolean;
  helperText?: string;
}

const OTP_LENGTH = 6;

export default function OtpInput({
  value,
  onChange,
  error,
  helperText,
}: OtpInputProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, OTP_LENGTH);
    onChange(val);
  };

  return (
    <Box>
      <Typography
        variant="body2"
        fontWeight={600}
        sx={{ mb: 1.5, textAlign: "center" }}
      >
        Enter 6-digit OTP
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <TextField
          value={value}
          onChange={handleChange}
          error={error}
          variant="outlined"
          autoFocus
          fullWidth
          autoComplete="one-time-code"
          inputProps={{
            maxLength: OTP_LENGTH,
            inputMode: "numeric",
            style: {
              textAlign: "center",
              fontSize: "2rem",
              fontWeight: 800,
              letterSpacing: "0.8rem",
              padding: "18px 0",
              textIndent: "0.8rem", // Balance the initial letter spacing
            },
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 3,
              bgcolor: "grey.50",
              "& fieldset": {
                borderColor: "grey.300",
                borderWidth: 2,
              },
              "&:hover fieldset": {
                borderColor: "primary.main",
              },
              "&.Mui-focused fieldset": {
                borderColor: "primary.main",
              },
            },
            "& .MuiInputBase-input::placeholder": {
              letterSpacing: "normal",
              textIndent: 0,
            },
          }}
          placeholder="000 000"
        />
      </Box>


      {helperText && (
        <Typography
          variant="caption"
          color="error"
          sx={{ display: "block", textAlign: "center", mt: 1, fontWeight: 500 }}
        >
          {helperText}
        </Typography>
      )}
    </Box>
  );
}

