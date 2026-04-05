import { Navbar } from "@/components/common";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import AssessmentIcon from "@mui/icons-material/Assessment";
import GroupsIcon from "@mui/icons-material/Groups";
import SecurityIcon from "@mui/icons-material/Security";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import {
  Box,
  Button,
  Container,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import Head from "next/head";
import Link from "next/link";

// --- Data Constants ---
const FEATURES = [
  {
    icon: <VerifiedUserIcon sx={{ fontSize: 40, color: "primary.main" }} />,
    title: "Certified Auditors",
    description: "Access a network of verified and certified auditing professionals across multiple jurisdictions.",
  },
  {
    icon: <SecurityIcon sx={{ fontSize: 40, color: "primary.main" }} />,
    title: "Compliance Ready",
    description: "Stay compliant with IFRS, GAAP, ICAI and other international auditing standards effortlessly.",
  },
  {
    icon: <AssessmentIcon sx={{ fontSize: 40, color: "primary.main" }} />,
    title: "Real-time Reporting",
    description: "Generate and access audit reports in real-time with comprehensive dashboards and analytics.",
  },
  {
    icon: <GroupsIcon sx={{ fontSize: 40, color: "primary.main" }} />,
    title: "Multi-team Collaboration",
    description: "Collaborate across audit teams with role-based access, task assignments, and shared workspaces.",
  },
];

const STATS = [
  { value: "500+", label: "Registered Companies" },
  { value: "1,200+", label: "Certified Auditors" },
  { value: "30+", label: "Jurisdictions" },
  { value: "99.9%", label: "Uptime" },
];

// --- Sub-components ---

const SectionTitle = ({ title, subtitle }: { title: string; subtitle?: string }) => (
  <Stack spacing={1.5} alignItems="center" textAlign="center" sx={{ mb: 6 }}>
    <Typography variant="h4" fontWeight={800} sx={{ letterSpacing: "-0.02em" }}>
      {title}
    </Typography>
    {subtitle && (
      <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 520 }}>
        {subtitle}
      </Typography>
    )}
  </Stack>
);

const Hero = () => (
  <Box sx={{ flex: 1, display: "flex", alignItems: "center", bgcolor: "background.default", py: { xs: 8, md: 12 }, px: 2 }}>
    <Container maxWidth="md">
      <Stack spacing={4} alignItems="center" textAlign="center">
        <Typography variant="h2" fontWeight={900} sx={{ fontSize: { xs: "2.5rem", sm: "3.5rem", md: "4rem" }, lineHeight: 1.1, letterSpacing: "-0.04em" }}>
          Financial Intelligence & <Box component="span" sx={{ color: "primary.main" }}>Compliance</Box> Platform
        </Typography>
        <Typography variant="h6" color="text.secondary" fontWeight={400} sx={{ maxWidth: 650, fontSize: { xs: "1.05rem", sm: "1.25rem" }, lineHeight: 1.6 }}>
          Streamline your auditing workflows, manage compliance across jurisdictions, and onboard certified auditors — all in one unified, cloud-native platform.
        </Typography>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ pt: 2 }}>
          <Button component={Link} href="/register" variant="contained" size="large" endIcon={<ArrowForwardIcon />} sx={{ py: 2, px: 5, fontSize: "1rem", fontWeight: 700, borderRadius: 3 }}>
            Register Your Company
          </Button>
          <Button component={Link} href="/users" variant="outlined" size="large" sx={{ py: 2, px: 5, fontSize: "1rem", fontWeight: 700, borderRadius: 3, borderWidth: 2, "&:hover": { borderWidth: 2 } }}>
            View Auditors
          </Button>
        </Stack>
      </Stack>
    </Container>
  </Box>
);

const Stats = () => (
  <Box sx={{ bgcolor: "primary.main", py: 6 }}>
    <Container maxWidth="lg">
      <Grid container spacing={4} justifyContent="center">
        {STATS.map((stat) => (
          <Grid size={{ xs: 6, sm: 3 }} key={stat.label}>
            <Stack alignItems="center" spacing={0.5}>
              <Typography variant="h4" fontWeight={900} color="#fff" sx={{ letterSpacing: "-0.02em" }}>
                {stat.value}
              </Typography>
              <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.85)", fontWeight: 600, textTransform: "uppercase", fontSize: "0.75rem", letterSpacing: "0.05em" }}>
                {stat.label}
              </Typography>
            </Stack>
          </Grid>
        ))}
      </Grid>
    </Container>
  </Box>
);

const Features = () => (
  <Box sx={{ py: { xs: 8, md: 15 }, px: 2, bgcolor: "background.paper" }}>
    <Container maxWidth="lg">
      <SectionTitle title="Why Choose Audit FIS?" subtitle="Everything you need to manage audits, compliance, and multi-team collaboration in one secure workspace." />
      <Grid container spacing={3}>
        {FEATURES.map((feature) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={feature.title}>
            <Paper elevation={0} sx={{ p: 4, height: "100%", borderRadius: 4, border: "1px solid", borderColor: "grey.200", transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)", "&:hover": { boxShadow: "0 24px 48px rgba(0,0,0,0.06)", transform: "translateY(-8px)", borderColor: "primary.light" } }}>
              <Stack spacing={2.5}>
                <Box sx={{ opacity: 0.9 }}>{feature.icon}</Box>
                <Typography variant="h6" fontWeight={800} sx={{ letterSpacing: "-0.01em" }}>
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.8, fontSize: "0.925rem" }}>
                  {feature.description}
                </Typography>
              </Stack>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  </Box>
);


const CTA = () => (
  <Box sx={{ py: { xs: 8, md: 12 }, px: 2, bgcolor: "grey.50" }}>
    <Container maxWidth="sm">
      <Paper elevation={0} sx={{ p: { xs: 5, sm: 8 }, borderRadius: 6, border: "1px solid", borderColor: "grey.200", textAlign: "center", boxShadow: "0 10px 30px rgba(0,0,0,0.02)" }}>
        <Typography variant="h4" fontWeight={900} gutterBottom sx={{ letterSpacing: "-0.02em" }}>
          Ready to get started?
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 5, fontSize: "1.1rem" }}>
          Join the next generation of financial auditing. Build your professional profile or register your firm today.
        </Typography>
        <Button component={Link} href="/register" variant="contained" size="large" endIcon={<ArrowForwardIcon />} sx={{ py: 2, px: 6, fontSize: "1.1rem", fontWeight: 700, borderRadius: 3 }}>
          Start Registration
        </Button>
      </Paper>
    </Container>
  </Box>
);

const Footer = () => (
  <Box component="footer" sx={{ py: 5, px: 2, borderTop: "1px solid", borderColor: "grey.100", bgcolor: "background.paper", textAlign: "center" }}>
    <Typography variant="body2" color="text.secondary" fontWeight={500}>
      © {new Date().getFullYear()} Audit FIS. Precision Audit Compliance. All rights reserved.
    </Typography>
  </Box>
);

// --- Main Page Component ---

export default function Home() {
  return (
    <>
      <Head>
        <title>Audit FIS — Intelligent Financial Compliance</title>
        <meta name="description" content="Global standard for auditor registration and compliance intelligence." />
      </Head>

      <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <Navbar
          actions={
            <Button component={Link} href="/register" variant="contained" size="small" endIcon={<ArrowForwardIcon />} sx={{ fontWeight: 700, borderRadius: 2 }}>
              Get Started
            </Button>
          }
        />

        <Hero />
        <Stats />
        <Features />
        <CTA />
        <Footer />
      </Box>
    </>
  );
}