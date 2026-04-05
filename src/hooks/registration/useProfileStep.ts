import {
  AUDIT_SECTOR_MAPPING,
  CertificationFormData,
  ProfileFormData,
  profileSchema,
} from "@/schemas/registration";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";

interface UseProfileStepProps {
  defaultValues: Partial<ProfileFormData>;
  certifications: CertificationFormData[];
  onCertificationsChange: (certs: CertificationFormData[]) => void;
  onSuccess: (data: ProfileFormData) => void;
}

/**
 * useProfileStep Hook
 * Encapsulates the logic for auditor profile completion,
 * including dynamic sector selection and professional credential life-cycle.
 */
export function useProfileStep({
  defaultValues,
  certifications,
  onCertificationsChange,
  onSuccess,
}: UseProfileStepProps) {
  // Modal state for dynamic certifications
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  // --- Main Form Setup ---

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      primaryAuditSector: "",
      specializedAuditArea: "",
      jurisdictions: [],
      independenceDeclaration: false as unknown as true,
      ...defaultValues,
    },
  });

  const selectedSector = watch("primaryAuditSector");

  /** Dynamic sub-sector options based on the chosen primary domain */
  const specializedAreaOptions = useMemo(() => {
    if (!selectedSector) return [];
    return AUDIT_SECTOR_MAPPING[selectedSector] || [];
  }, [selectedSector]);

  /** Reset dependent specialized field when primary sector changes */
  useEffect(() => {
    setValue("specializedAuditArea", "");
  }, [selectedSector, setValue]);

  // --- Certification Handlers ---

  const handleOpenAdd = useCallback(() => {
    setEditingIndex(null);
    setDialogOpen(true);
  }, []);

  const handleOpenEdit = useCallback((index: number) => {
    setEditingIndex(index);
    setDialogOpen(true);
  }, []);

  const handleRemove = useCallback((index: number) => {
    onCertificationsChange(certifications.filter((_, i) => i !== index));
  }, [certifications, onCertificationsChange]);

  /** Persists certification changes (Add or Update) */
  const handleSave = useCallback((cert: CertificationFormData) => {
    if (editingIndex !== null) {
      const updated = [...certifications];
      updated[editingIndex] = cert;
      onCertificationsChange(updated);
    } else {
      onCertificationsChange([...certifications, cert]);
    }
  }, [certifications, editingIndex, onCertificationsChange]);

  return {
    control,
    handleSubmit: handleSubmit(onSuccess),
    errors,
    specializedAreaOptions,
    dialogOpen,
    setDialogOpen,
    editingIndex,
    handleOpenAdd,
    handleOpenEdit,
    handleRemove,
    handleSave,
    selectedSector,
  };
}
