import Button, { ButtonProps } from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";

interface LoadingButtonProps extends ButtonProps {
  loading?: boolean;
  loadingText?: string;
}

export default function LoadingButton({
  loading = false,
  loadingText,
  disabled,
  children,
  startIcon,
  ...rest
}: LoadingButtonProps) {
  return (
    <Button
      {...rest}
      disabled={loading || disabled}
      startIcon={
        loading ? (
          <CircularProgress size={18} color="inherit" />
        ) : (
          startIcon
        )
      }
    >
      {loading && loadingText ? loadingText : children}
    </Button>
  );
}
