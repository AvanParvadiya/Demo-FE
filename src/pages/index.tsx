import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <title>Demo App</title>
        <meta name="description" content="Demo application built with Next.js and MUI" />
      </Head>

      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "background.default",
        }}
      >
        <Container maxWidth="sm">
          <Stack spacing={3} alignItems="center" textAlign="center">
            <RocketLaunchIcon
              sx={{ fontSize: 64, color: "primary.main" }}
            />
            <Typography variant="h3" component="h1" fontWeight={700}>
              Welcome to Demo App
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Built with Next.js &amp; Material UI. Edit{" "}
              <Typography
                component="code"
                sx={{
                  bgcolor: "grey.100",
                  px: 1,
                  py: 0.5,
                  borderRadius: 1,
                  fontFamily: "monospace",
                  fontSize: "0.875rem",
                }}
              >
                src/pages/index.tsx
              </Typography>{" "}
              to get started.
            </Typography>
            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                size="large"
                href="https://mui.com/material-ui/getting-started/"
                target="_blank"
                rel="noopener noreferrer"
              >
                MUI Docs
              </Button>
              <Button
                variant="outlined"
                size="large"
                href="https://nextjs.org/docs"
                target="_blank"
                rel="noopener noreferrer"
              >
                Next.js Docs
              </Button>
            </Stack>
          </Stack>
        </Container>
      </Box>
    </>
  );
}
