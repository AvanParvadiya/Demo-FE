import { ReactNode } from "react";
import Link from "next/link";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";

export interface NavItem {
  label: string;
  href: string;
}

interface NavbarProps {
  /** Navigation links displayed in the center/right */
  navItems?: NavItem[];
  /** Action buttons on the far right */
  actions?: ReactNode;
}

export default function Navbar({ navItems = [], actions }: NavbarProps) {
  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: "background.paper",
        borderBottom: "1px solid",
        borderColor: "grey.200",
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        {/* Logo */}
        <Typography
          component={Link}
          href="/"
          variant="h5"
          fontWeight={800}
          color="primary.main"
          sx={{
            textDecoration: "none",
            letterSpacing: "-0.02em",
          }}
        >
          Audit FIS
        </Typography>

        {/* Nav Links + Actions */}
        <Stack direction="row" alignItems="center" spacing={1}>
          {navItems.map((item) => (
            <Button
              key={item.href}
              component={Link}
              href={item.href}
              color="inherit"
              sx={{
                color: "text.secondary",
                fontWeight: 500,
                "&:hover": { color: "text.primary" },
              }}
            >
              {item.label}
            </Button>
          ))}

          {actions && (
            <Box sx={{ ml: 1.5 }}>{actions}</Box>
          )}
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
