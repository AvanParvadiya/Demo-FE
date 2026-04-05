import { ReactNode } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import MuiLink from "@mui/material/Link";
import Link from "next/link";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
  /** Action buttons rendered on the right side */
  actions?: ReactNode;
}

export default function PageHeader({
  title,
  subtitle,
  breadcrumbs,
  actions,
}: PageHeaderProps) {
  return (
    <Box sx={{ mb: 3 }}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <Breadcrumbs
          separator={<NavigateNextIcon fontSize="small" />}
          sx={{ mb: 1.5 }}
        >
          {breadcrumbs.map((crumb, index) =>
            crumb.href ? (
              <MuiLink
                component={Link}
                href={crumb.href}
                key={index}
                underline="hover"
                color="text.secondary"
                sx={{ fontSize: "0.875rem" }}
              >
                {crumb.label}
              </MuiLink>
            ) : (
              <Typography
                key={index}
                color="text.primary"
                sx={{ fontSize: "0.875rem", fontWeight: 500 }}
              >
                {crumb.label}
              </Typography>
            )
          )}
        </Breadcrumbs>
      )}

      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        spacing={2}
      >
        <Box>
          <Typography variant="h4" fontWeight={700} component="h1">
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
              {subtitle}
            </Typography>
          )}
        </Box>

        {actions && (
          <Stack direction="row" spacing={1.5} flexShrink={0}>
            {actions}
          </Stack>
        )}
      </Stack>
    </Box>
  );
}
