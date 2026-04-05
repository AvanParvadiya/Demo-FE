import { ReactNode } from "react";
import Head from "next/head";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";

interface PageContainerProps {
  title: string;
  description?: string;
  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl";
  children: ReactNode;
  /** If true, centers content vertically in viewport */
  centered?: boolean;
  /** Remove default padding */
  noPadding?: boolean;
}

export default function PageContainer({
  title,
  description,
  maxWidth = "lg",
  children,
  centered = false,
  noPadding = false,
}: PageContainerProps) {
  return (
    <>
      <Head>
        <title>{title} — Audit FIS</title>
        {description && <meta name="description" content={description} />}
      </Head>

      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "background.default",
          display: centered ? "flex" : "block",
          alignItems: centered ? "center" : undefined,
          justifyContent: centered ? "center" : undefined,
          py: noPadding ? 0 : { xs: 3, md: 4 },
        }}
      >
        <Container
          maxWidth={maxWidth}
          disableGutters={noPadding}
          sx={{ px: noPadding ? 0 : { xs: 2, sm: 3 } }}
        >
          {children}
        </Container>
      </Box>
    </>
  );
}
