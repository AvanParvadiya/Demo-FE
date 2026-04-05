import { CertificationFormData } from "@/schemas/registration";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditIcon from "@mui/icons-material/Edit";
import { Chip, IconButton, Stack, Tooltip, Typography } from "@mui/material";

interface CertificationItemProps {
    /** The certification data object (type, license, year) */
    cert: CertificationFormData;
    /** Handler to open the edit dialog for this specific item */
    onEdit: () => void;
    /** Handler to remove this item from the profile */
    onRemove: () => void;
    /** Global loading state to disable actions during API calls */
    disabled: boolean;
}

/**
 * CertificationItem Component
 * Renders a single row representing an auditor's professional credential.
 * Features a visual chip for the qualification type (CA, ACCA, etc.) and
 * action buttons for managing the entry.
 */
const CertificationItem = ({
    cert,
    onEdit,
    onRemove,
    disabled,
}: CertificationItemProps) => (
    <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{
            py: 1.5,
            px: 2,
            bgcolor: "#fff",
            borderRadius: 2,
            border: "1px solid",
            borderColor: "grey.200",
            transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
            "&:hover": {
                borderColor: "primary.light",
                boxShadow: "0 2px 8px rgba(0,0,0,0.04)"
            },
        }}
    >
        {/* Identity Info: Type & License */}
        <Stack spacing={0.5}>
            <Stack direction="row" spacing={1} alignItems="center">
                <Chip
                    label={cert.type}
                    color="primary"
                    size="small"
                    sx={{ fontWeight: 800, borderRadius: 1 }}
                />
                <Typography variant="body2" fontWeight={700} color="text.primary">
                    {cert.licenseNumber}
                </Typography>
            </Stack>
            <Typography variant="caption" color="text.secondary" fontWeight={500}>
                Qualified in {cert.year}
            </Typography>
        </Stack>

        {/* Management Actions: Edit & Delete */}
        <Stack direction="row" spacing={0.5}>
            <Tooltip title="Edit Credential" arrow>
                <span>
                    <IconButton
                        size="small"
                        color="primary"
                        onClick={onEdit}
                        disabled={disabled}
                        sx={{ transition: "color 0.2s" }}
                    >
                        <EditIcon fontSize="small" />
                    </IconButton>
                </span>
            </Tooltip>
            <Tooltip title="Remove" arrow>
                <span>
                    <IconButton
                        size="small"
                        color="error"
                        onClick={onRemove}
                        disabled={disabled}
                        sx={{ transition: "color 0.2s" }}
                    >
                        <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                </span>
            </Tooltip>
        </Stack>
    </Stack>
);

export default CertificationItem;
