import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import AssessmentIcon from "@mui/icons-material/Assessment";
import GroupsIcon from "@mui/icons-material/Groups";
import SecurityIcon from "@mui/icons-material/Security";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Head from "next/head";
import Link from "next/link";

const FEATURES = [
  {
    icon: <VerifiedUserIcon sx={{ fontSize: 40, color: "primary.main" }} />,
    title: "Certified Auditors",
    description:
      "Access a network of verified and certified auditing professionals across multiple jurisdictions.",
  },
  {
    icon: <SecurityIcon sx={{ fontSize: 40, color: "primary.main" }} />,
    title: "Compliance Ready",
    description:
      "Stay compliant with IFRS, GAAP, ICAI and other international auditing standards effortlessly.",
  },
  {
    icon: <AssessmentIcon sx={{ fontSize: 40, color: "primary.main" }} />,
    title: "Real-time Reporting",
    description:
      "Generate and access audit reports in real-time with comprehensive dashboards and analytics.",
  },
  {
    icon: <GroupsIcon sx={{ fontSize: 40, color: "primary.main" }} />,
    title: "Multi-team Collaboration",
    description:
      "Collaborate across audit teams with role-based access, task assignments, and shared workspaces.",
  },
];

const STATS = [
  { value: "500+", label: "Registered Companies" },
  { value: "1,200+", label: "Certified Auditors" },
  { value: "30+", label: "Jurisdictions" },
  { value: "99.9%", label: "Uptime" },
];

export default function Home() {
  return (
    <>
      <Head>
        <title>Audit FIS — Financial Intelligence & Compliance Platform</title>
        <meta
          name="description"
          content="Audit FIS is the leading platform for financial auditing, compliance, and company registration across global jurisdictions."
        />
      </Head>

      {/* Hero Section */}
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Navbar */}
        <Box
          component="header"
          sx={{
            py: 2,
            px: { xs: 2, sm: 4 },
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid",
            borderColor: "grey.200",
            bgcolor: "background.paper",
          }}
        >
          <Typography
            variant="h5"
            fontWeight={800}
            color="primary.main"
            sx={{ letterSpacing: "-0.02em" }}
          >
            Audit FIS
          </Typography>
          <Button
            component={Link}
            href="/register"
            variant="contained"
            size="medium"
            endIcon={<ArrowForwardIcon />}
          >
            Register Now
          </Button>
        </Box>

        {/* Hero Content */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "background.default",
            py: { xs: 6, md: 10 },
            px: 2,
          }}
        >
          <Container maxWidth="md">
            <Stack spacing={4} alignItems="center" textAlign="center">
              <Typography
                variant="h2"
                fontWeight={800}
                sx={{
                  fontSize: { xs: "2rem", sm: "2.75rem", md: "3.25rem" },
                  lineHeight: 1.2,
                  letterSpacing: "-0.02em",
                }}
              >
                Financial Intelligence &{" "}
                <Typography
                  component="span"
                  variant="inherit"
                  color="primary.main"
                >
                  Compliance
                </Typography>{" "}
                Platform
              </Typography>

              <Typography
                variant="h6"
                color="text.secondary"
                fontWeight={400}
                sx={{
                  maxWidth: 600,
                  fontSize: { xs: "1rem", sm: "1.15rem" },
                  lineHeight: 1.6,
                }}
              >
                Streamline your auditing workflows, manage compliance across
                jurisdictions, and onboard certified auditors — all in one
                platform.
              </Typography>

              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <Button
                  component={Link}
                  href="/register"
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    py: 1.5,
                    px: 4,
                    fontSize: "1rem",
                    fontWeight: 600,
                  }}
                >
                  Register Your Company
                </Button>
                <Button
                  component={Link}
                  href="/users"
                  variant="outlined"
                  size="large"
                  sx={{
                    py: 1.5,
                    px: 4,
                    fontSize: "1rem",
                    fontWeight: 600,
                  }}
                >
                  View Auditors
                </Button>
              </Stack>

            </Stack>
          </Container>
        </Box>

        {/* Stats Banner */}
        <Box
          sx={{
            bgcolor: "primary.main",
            py: 4,
            px: 2,
          }}
        >
          <Container maxWidth="lg">
            <Grid container spacing={3} justifyContent="center">
              {STATS.map((stat) => (
                <Grid size={{ xs: 6, sm: 3 }} key={stat.label}>
                  <Stack alignItems="center" spacing={0.5}>
                    <Typography
                      variant="h4"
                      fontWeight={800}
                      color="#fff"
                    >
                      {stat.value}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "rgba(255,255,255,0.8)" }}
                    >
                      {stat.label}
                    </Typography>
                  </Stack>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>

        {/* Features Section */}
        <Box
          sx={{
            py: { xs: 6, md: 10 },
            px: 2,
            bgcolor: "background.paper",
          }}
        >
          <Container maxWidth="lg">
            <Stack spacing={6}>
              <Stack spacing={1.5} alignItems="center" textAlign="center">
                <Typography variant="h4" fontWeight={700}>
                  Why Choose Audit FIS?
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ maxWidth: 520 }}
                >
                  Everything you need to manage audits, compliance, and team
                  collaboration in one place.
                </Typography>
              </Stack>

              <Grid container spacing={3}>
                {FEATURES.map((feature) => (
                  <Grid size={{ xs: 12, sm: 6, md: 3 }} key={feature.title}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 3.5,
                        height: "100%",
                        borderRadius: 3,
                        border: "1px solid",
                        borderColor: "grey.200",
                        transition: "box-shadow 0.25s, transform 0.25s",
                        "&:hover": {
                          boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                          transform: "translateY(-4px)",
                        },
                      }}
                    >
                      <Stack spacing={2}>
                        <Box>{feature.icon}</Box>
                        <Typography variant="h6" fontWeight={700}>
                          {feature.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ lineHeight: 1.7 }}
                        >
                          {feature.description}
                        </Typography>
                      </Stack>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Stack>
          </Container>
        </Box>

        {/* CTA Section */}
        <Box
          sx={{
            py: { xs: 6, md: 8 },
            px: 2,
            bgcolor: "background.default",
          }}
        >
          <Container maxWidth="sm">
            <Paper
              elevation={0}
              sx={{
                p: { xs: 4, sm: 5 },
                borderRadius: 4,
                border: "1px solid",
                borderColor: "grey.200",
                textAlign: "center",
              }}
            >
              <Typography variant="h5" fontWeight={700} gutterBottom>
                Ready to get started?
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ mb: 3 }}
              >
                Register your company today and join hundreds of organizations
                already using Audit FIS for their compliance needs.
              </Typography>
              <Button
                component={Link}
                href="/register"
                variant="contained"
                size="large"
                endIcon={<ArrowForwardIcon />}
                sx={{ py: 1.5, px: 5, fontSize: "1rem", fontWeight: 600 }}
              >
                Start Registration
              </Button>
            </Paper>
          </Container>
        </Box>

        {/* Footer */}
        <Box
          component="footer"
          sx={{
            py: 3,
            px: 2,
            borderTop: "1px solid",
            borderColor: "grey.200",
            bgcolor: "background.paper",
            textAlign: "center",
          }}
        >
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} Audit FIS. All rights reserved.
          </Typography>
        </Box>
      </Box>
    </>
  );
}
