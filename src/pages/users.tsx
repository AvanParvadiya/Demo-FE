import DataTable, { Column } from "@/components/common/DataTable";
import { useApiGet } from "@/hooks";
import { API_ENDPOINTS } from "@/lib";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EmailIcon from "@mui/icons-material/Email";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Container,
  Fade,
  Paper,
  Skeleton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import Head from "next/head";
import Link from "next/link";

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

export default function UsersListPage() {
  const { data, loading, error } = useApiGet<{ total: number; items: User[] }>(
    API_ENDPOINTS.USERS.LIST
  );

  const users = data?.items || [];

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

  return (
    <>
      <Head>
        <title>Auditor Directory — Audit FIS</title>
      </Head>

      <Box sx={{ minHeight: "100vh", bgcolor: "background.default", py: 6 }}>
        <Container maxWidth="lg">
          {/* Header */}
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", sm: "center" }}
            spacing={3}
            sx={{ mb: 6 }}
          >
            <Box>
              <Typography
                variant="h3"
                fontWeight={800}
                sx={{
                  letterSpacing: "-0.03em",
                  mb: 1,
                  fontSize: { xs: "2.25rem", sm: "3rem" },
                }}
              >
                Auditor Directory
              </Typography>
              <Typography variant="h6" color="text.secondary" fontWeight={400}>
                Managing {users.length} registered financial professionals
              </Typography>
            </Box>
            <Button
              component={Link}
              href="/"
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              sx={{
                borderRadius: 2,
                px: 3,
                fontWeight: 700,
                borderWidth: 2,
                "&:hover": { borderWidth: 2 },
              }}
            >
              Back to Home
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
              boxShadow: "0 10px 40px rgba(0,0,0,0.04)",
              overflow: "hidden",
            }}
          >
            {loading ? (
              <Stack spacing={2} p={2}>
                <Skeleton variant="rectangular" height={60} sx={{ borderRadius: 1 }} />
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} variant="rectangular" height={52} sx={{ borderRadius: 1 }} />
                ))}
              </Stack>
            ) : error ? (
              <Box sx={{ p: 4, textAlign: "center" }}>
                <Typography color="error.main" fontWeight={700}>
                  Failed to load auditors.
                </Typography>
              </Box>
            ) : (
              <Fade in timeout={600}>
                <Box>
                  <DataTable
                    columns={columns}
                    rows={users}
                    getRowId={(row) => row.id}
                    emptyMessage="No auditors registered in the system yet."
                  />
                </Box>
              </Fade>
            )}
          </Paper>
        </Container>
      </Box>
    </>
  );
}

