import { STEP_LABELS } from "@/schemas/registration";
import Box from "@mui/material/Box";
import Step from "@mui/material/Step";
import StepConnector, {
  stepConnectorClasses,
} from "@mui/material/StepConnector";
import { StepIconProps } from "@mui/material/StepIcon";
import StepLabel from "@mui/material/StepLabel";
import Stepper from "@mui/material/Stepper";
import { styled } from "@mui/material/styles";

// Custom connector line between steps
const CustomConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 18,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundColor: theme.palette.primary.main,
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundColor: theme.palette.primary.main,
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor: theme.palette.grey[300],
    borderRadius: 1,
  },
}));

// Custom circle icon for each step
function CustomStepIcon(props: StepIconProps) {
  const { active, completed, icon } = props;

  const isActiveOrCompleted = active || completed;

  return (
    <Box
      sx={{
        width: 38,
        height: 38,
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: isActiveOrCompleted ? "primary.main" : "grey.300",
        color: isActiveOrCompleted ? "#fff" : "text.secondary",
        fontWeight: 700,
        fontSize: "0.95rem",
        transition: "all 0.3s ease",
        boxShadow: isActiveOrCompleted
          ? "0 2px 8px rgba(25, 118, 210, 0.35)"
          : "none",
      }}
    >
      {icon}
    </Box>
  );
}

interface StepperHeaderProps {
  activeStep: number;
}

export default function StepperHeader({ activeStep }: StepperHeaderProps) {
  return (
    <Stepper
      activeStep={activeStep}
      alternativeLabel
      connector={<CustomConnector />}
      sx={{ mb: 4, pt: 1 }}
    >
      {STEP_LABELS.map((label) => (
        <Step key={label}>
          <StepLabel
            StepIconComponent={CustomStepIcon}
            sx={{
              "& .MuiStepLabel-label": {
                mt: 1,
                fontSize: "0.82rem",
                fontWeight: 600,
              },
              "& .MuiStepLabel-label.Mui-active": {
                color: "primary.main",
              },
              "& .MuiStepLabel-label.Mui-completed": {
                color: "primary.main",
              },
            }}
          >
            {label}
          </StepLabel>
        </Step>
      ))}
    </Stepper>
  );
}
