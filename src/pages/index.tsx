import { Navbar } from "@/components/common";
import DataTable, { Column } from "@/components/common/DataTable";
import { useApiGet } from "@/hooks";
import { API_ENDPOINTS } from "@/lib";
import EmailIcon from "@mui/icons-material/Email";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Container,
  Paper,
  Stack,
  Tooltip,
  Typography
} from "@mui/material";
import Head from "next/head";
import Link from "next/link";

// --- Types ---
interface User extends Record<string, unknown> {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  primaryAuditSector: string;
  specializedAuditArea: string;
  jurisdictions: string[];
  certifications: {
    type: string;
    licenseNumber: string;
    year: string;
  }[];
}

// --- Table Configuration ---
const columns: Column<User>[] = [
  {
    id: "name",
    label: "Auditor Name",
    sortable: true,
    minWidth: 200,
    render: (row) => (
      <Stack direction="row" spacing={1.5} alignItems="center">
        <Avatar
          sx={{
            width: 32,
            height: 32,
            bgcolor: "primary.50",
            color: "primary.main",
            fontSize: "0.875rem",
            fontWeight: 700,
          }}
        >
          {row.firstName[0]}
          {row.lastName[0]}
        </Avatar>
        <Typography variant="body2" fontWeight={600}>
          {row.firstName} {row.lastName}
        </Typography>
      </Stack>
    ),
  },
  {
    id: "email",
    label: "Email Address",
    sortable: true,
    minWidth: 220,
    render: (row) => (
      <Stack direction="row" spacing={1} alignItems="center" color="text.secondary">
        <EmailIcon sx={{ fontSize: 16 }} />
        <Typography variant="body2">{row.email}</Typography>
      </Stack>
    ),
  },
  {
    id: "primaryAuditSector",
    label: "Audit Sector",
    sortable: true,
    minWidth: 160,
    render: (row) => (
      <Chip
        label={row.primaryAuditSector}
        size="small"
        sx={{
          bgcolor: "grey.50",
          fontWeight: 600,
          borderRadius: 1,
          fontSize: "0.75rem",
        }}
      />
    ),
  },
  {
    id: "specializedAuditArea",
    label: "Specialization",
    sortable: true,
    minWidth: 160,
    render: (row) => (
      <Typography variant="body2" color="text.secondary" fontWeight={500}>
        {row.specializedAuditArea}
      </Typography>
    ),
  },
  {
    id: "jurisdictions",
    label: "Jurisdictions",
    minWidth: 220,
    render: (row) => (
      <Stack direction="row" spacing={0.5} flexWrap="wrap" gap={0.5}>
        {row.jurisdictions.slice(0, 2).map((j) => (
          <Chip
            key={j}
            label={j.replace("_", " ")}
            size="small"
            variant="outlined"
            sx={{ p: 0, height: 20, fontSize: "0.7rem", fontWeight: 600 }}
          />
        ))}
        {row.jurisdictions.length > 2 && (
          <Tooltip title={row.jurisdictions.slice(2).join(", ")}>
            <Chip
              label={`+${row.jurisdictions.length - 2}`}
              size="small"
              sx={{ height: 20, fontSize: "0.7rem", fontWeight: 600 }}
            />
          </Tooltip>
        )}
      </Stack>
    ),
  },
  {
    id: "certifications",
    label: "Credentials",
    minWidth: 140,
    render: (row) => (
      <Stack direction="row" spacing={0.5}>
        {row.certifications.length > 0 ? (
          row.certifications.map((c, i) => (
            <Tooltip key={i} title={`${c.type} - Lic: ${c.licenseNumber}`}>
              <Chip
                label={c.type}
                size="small"
                color="primary"
                variant="outlined"
                sx={{
                  height: 22,
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  bgcolor: "primary.50",
                  color: "primary.main",
                }}
              />
            </Tooltip>
          ))
        ) : (
          <Typography variant="caption" color="text.disabled">
            None
          </Typography>
        )}
      </Stack>
    ),
  },
];

// --- Sub-components ---

const Footer = () => (
  <Box component="footer" sx={{ py: 5, px: 2, borderTop: "1px solid", borderColor: "grey.100", bgcolor: "background.paper", textAlign: "center", mt: "auto" }}>
    <Typography variant="body2" color="text.secondary" fontWeight={500}>
      © {new Date().getFullYear()} Audit FIS. Precision Audit Compliance. All rights reserved.
    </Typography>
  </Box>
);

// --- Main Page Component ---

export default function Home() {
  const { data, loading, error } = useApiGet<{ total: number; items: User[] }>(
    API_ENDPOINTS.USERS.LIST
  );

  const users = data?.items || [];

  return (
    <>
      <Head>
        <title>Audit FIS — Intelligent Financial Compliance</title>
        <meta name="description" content="Global standard for auditor registration and compliance intelligence." />
      </Head>

      <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", bgcolor: "background.default" }}>
        <Navbar
          actions={
            <Button component={Link} href="/register" variant="contained" size="small" endIcon={<PersonAddIcon />} sx={{ fontWeight: 700, borderRadius: 2 }}>
              Register
            </Button>
          }
        />

        <Container maxWidth="lg" sx={{ py: 6 }}>
          {/* Header Section */}
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", sm: "center" }}
            spacing={3}
            sx={{ mb: 6 }}
          >
            <Box>
              <Typography
                variant="h4"
                fontWeight={900}
                sx={{
                  letterSpacing: "-0.04em",
                  mb: 1,
                }}
              >
                Auditor Directory
              </Typography>
              <Typography variant="h6" color="text.secondary" fontWeight={400} sx={{ opacity: 0.8 }}>
                Browse through our community of {users.length} certified auditing professionals.
              </Typography>
            </Box>

            <Button
              component={Link}
              href="/register"
              variant="contained"
              startIcon={<PersonAddIcon />}
              sx={{
                fontSize: "1.1rem",
                fontWeight: 700,
                borderRadius: 3,
                boxShadow: "0 8px 16px rgba(var(--primary-rgb), 0.2)",
              }}
            >
              Register Now
            </Button>
          </Stack>

          {/* Table Surface */}
          <Paper
            elevation={0}
            sx={{
              p: 1,
              borderRadius: 4,
              border: "1px solid",
              borderColor: "grey.200",
              bgcolor: "background.paper",
              boxShadow: "0 20px 48px rgba(0,0,0,0.04)",
              overflow: "hidden",
            }}
          >
            {error ? (
              <Box sx={{ p: 8, textAlign: "center" }}>
                <Typography variant="h6" color="error.main" fontWeight={700}>
                  Failed to synchronize directory.
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Please verify your network connection or contact system administrator.
                </Typography>
              </Box>
            ) : (
              <Box>
                <DataTable
                  columns={columns}
                  rows={users}
                  loading={loading}
                  getRowId={(row) => row.id}
                  emptyMessage="No auditors found. Be the first to register!"
                />
              </Box>
            )}
          </Paper>
        </Container>

        <Footer />
      </Box>
    </>
  );
}