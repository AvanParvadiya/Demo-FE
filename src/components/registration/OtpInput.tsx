import { useRef, useCallback, KeyboardEvent, ClipboardEvent } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

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
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const digits = value.padEnd(OTP_LENGTH, "").slice(0, OTP_LENGTH).split("");

  const focusInput = useCallback((index: number) => {
    if (index >= 0 && index < OTP_LENGTH) {
      inputRefs.current[index]?.focus();
    }
  }, []);

  const handleChange = useCallback(
    (index: number, digit: string) => {
      if (!/^\d?$/.test(digit)) return; // only digits

      const newDigits = [...digits];
      newDigits[index] = digit;
      const newValue = newDigits.join("").replace(/\s/g, "");
      onChange(newValue);

      if (digit && index < OTP_LENGTH - 1) {
        focusInput(index + 1);
      }
    },
    [digits, onChange, focusInput]
  );

  const handleKeyDown = useCallback(
    (index: number, e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace" && !digits[index] && index > 0) {
        focusInput(index - 1);
      }
      if (e.key === "ArrowLeft" && index > 0) {
        focusInput(index - 1);
      }
      if (e.key === "ArrowRight" && index < OTP_LENGTH - 1) {
        focusInput(index + 1);
      }
    },
    [digits, focusInput]
  );

  const handlePaste = useCallback(
    (e: ClipboardEvent<HTMLInputElement>) => {
      e.preventDefault();
      const pastedData = e.clipboardData
        .getData("text")
        .replace(/\D/g, "")
        .slice(0, OTP_LENGTH);
      if (pastedData) {
        onChange(pastedData);
        focusInput(Math.min(pastedData.length, OTP_LENGTH - 1));
      }
    },
    [onChange, focusInput]
  );

  return (
    <Box>
      <Typography
        variant="body2"
        fontWeight={600}
        sx={{ mb: 1.5, textAlign: "center" }}
      >
        Enter OTP
      </Typography>

      <Box
        sx={{
          display: "flex",
          gap: 1.5,
          justifyContent: "center",
        }}
      >
        {Array.from({ length: OTP_LENGTH }).map((_, index) => (
          <TextField
            key={index}
            inputRef={(el) => {
              inputRefs.current[index] = el;
            }}
            value={digits[index] || ""}
            onChange={(e) => handleChange(index, e.target.value.slice(-1))}
            onKeyDown={(e) =>
              handleKeyDown(index, e as KeyboardEvent<HTMLInputElement>)
            }
            onPaste={handlePaste}
            error={error}
            inputProps={{
              maxLength: 1,
              inputMode: "numeric",
              pattern: "[0-9]*",
              style: {
                textAlign: "center",
                fontSize: "1.5rem",
                fontWeight: 600,
                padding: "12px 0",
                width: "44px",
                letterSpacing: 0,
              },
              "aria-label": `OTP digit ${index + 1}`,
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                transition: "border-color 0.2s",
              },
            }}
          />
        ))}
      </Box>

      {helperText && (
        <Typography
          variant="caption"
          color="error"
          sx={{ display: "block", textAlign: "center", mt: 1 }}
        >
          {helperText}
        </Typography>
      )}
    </Box>
  );
}
