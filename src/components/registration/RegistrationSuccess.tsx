import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Box, Button, Stack, Typography, Zoom } from "@mui/material";
import { useRouter } from "next/router";

/**
 * RegistrationSuccess Component
 * Displays a professional victory screen after successful auditor onboarding.
 * Features a call-to-action to proceed to the main auditor directory.
 */
export default function RegistrationSuccess() {
  const router = useRouter();

  return (
    <Zoom in timeout={600}>
      <Box sx={{ textAlign: "center", py: 4 }}>
        {/* Success Icon with Pulse Effect */}
        <Box
          sx={{
            display: "inline-flex",
            p: 2.5,
            borderRadius: "50%",
            bgcolor: "success.50",
            color: "success.main",
            mb: 3,
            animation: "pulse 2s infinite ease-in-out",
            "@keyframes pulse": {
              "0%": { transform: "scale(1)", boxShadow: "0 0 0 0 rgba(76, 175, 80, 0.4)" },
              "70%": { transform: "scale(1.05)", boxShadow: "0 0 0 15px rgba(76, 175, 80, 0)" },
              "100%": { transform: "scale(1)", boxShadow: "0 0 0 0 rgba(76, 175, 80, 0)" },
            },
          }}
        >
          <CheckCircleOutlineIcon sx={{ fontSize: 64 }} />
        </Box>

        {/* Success Message */}
        <Typography variant="h4" fontWeight={900} gutterBottom sx={{ letterSpacing: "-0.02em" }}>
          Registration Complete!
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 5, maxWidth: 360, mx: "auto", lineHeight: 1.6 }}>
          Congratulations! Your auditor profile has been successfully created and added to the FIS platform directory.
        </Typography>

        {/* Call to Action */}
        <Stack spacing={2} sx={{ maxWidth: 320, mx: "auto" }}>
          <Button
            variant="contained"
            size="large"
            fullWidth
            endIcon={<ArrowForwardIcon />}
            onClick={() => router.push("/users")}
            sx={{
              py: 2,
              fontSize: "1rem",
              fontWeight: 800,
              borderRadius: 3,
              boxShadow: "0 8px 24px rgba(25, 118, 210, 0.25)",
              textTransform: "none",
              "&:hover": {
                boxShadow: "0 12px 32px rgba(25, 118, 210, 0.35)",
                transform: "translateY(-2px)",
              },
              transition: "all 0.3s ease",
            }}
          >
            Go to Auditor Directory
          </Button>
          
          <Button
            variant="text"
            onClick={() => router.push("/")}
            sx={{ fontWeight: 700, color: "text.secondary", textTransform: "none" }}
          >
            Back to Home
          </Button>
        </Stack>
      </Box>
    </Zoom>
  );
}
