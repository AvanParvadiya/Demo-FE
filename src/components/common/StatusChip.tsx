import Chip, { ChipProps } from "@mui/material/Chip";

type StatusVariant =
  | "success"
  | "error"
  | "warning"
  | "info"
  | "default";

const STATUS_STYLES: Record<
  StatusVariant,
  { bgcolor: string; color: string }
> = {
  success: { bgcolor: "#e8f5e9", color: "#2e7d32" },
  error: { bgcolor: "#ffebee", color: "#c62828" },
  warning: { bgcolor: "#fff3e0", color: "#e65100" },
  info: { bgcolor: "#e3f2fd", color: "#1565c0" },
  default: { bgcolor: "#f5f5f5", color: "#616161" },
};

interface StatusChipProps extends Omit<ChipProps, "variant" | "color"> {
  status: StatusVariant;
}

export default function StatusChip({
  status,
  label,
  ...rest
}: StatusChipProps) {
  const style = STATUS_STYLES[status];

  return (
    <Chip
      {...rest}
      label={label}
      size={rest.size ?? "small"}
      sx={{
        bgcolor: style.bgcolor,
        color: style.color,
        fontWeight: 600,
        fontSize: "0.75rem",
        border: "none",
        ...rest.sx,
      }}
    />
  );
}
