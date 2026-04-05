import { ReactNode } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import InboxIcon from "@mui/icons-material/Inbox";

interface EmptyStateProps {
  /** Icon rendered above the title (defaults to InboxIcon) */
  icon?: ReactNode;
  title?: string;
  message?: string;
  /** Action button or link displayed below the message */
  action?: ReactNode;
}

export default function EmptyState({
  icon,
  title = "No data found",
  message,
  action,
}: EmptyStateProps) {
  return (
    <Box
      sx={{
        py: 8,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Stack spacing={2} alignItems="center" sx={{ maxWidth: 360 }}>
        <Box sx={{ color: "grey.400" }}>
          {icon ?? <InboxIcon sx={{ fontSize: 56 }} />}
        </Box>

        <Typography variant="h6" fontWeight={600} color="text.primary">
          {title}
        </Typography>

        {message && (
          <Typography
            variant="body2"
            color="text.secondary"
            textAlign="center"
            sx={{ lineHeight: 1.7 }}
          >
            {message}
          </Typography>
        )}

        {action && <Box sx={{ mt: 1 }}>{action}</Box>}
      </Stack>
    </Box>
  );
}
