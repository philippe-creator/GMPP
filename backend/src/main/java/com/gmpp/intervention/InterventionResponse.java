package com.gmpp.intervention;

import java.time.LocalDateTime;
import java.util.List;

public record InterventionResponse(
        Long id,
        Long machineId,
        String machineName,
        String machineLocation,
        Long maintenancePointId,
        String operationType,
        Long technicianId,
        String technicianName,
        String assignedByName,
        LocalDateTime plannedAt,
        LocalDateTime executedAt,
        LocalDateTime completedAt,
        LocalDateTime validatedAt,
        Integer durationMinutes,
        InterventionStatus status,
        FindingStatus findingStatus,
        String observations,
        String etatConstate,
        List<String> documentsJoints,
        String technicianSignature,
        String supervisorValidation,
        String correctionReport,
        boolean urgent,
        LocalDateTime createdAt
) {
    public static InterventionResponse from(Intervention i) {
        return new InterventionResponse(
                i.getId(),
                i.getMachine().getId(),
                i.getMachine().getName(),
                i.getMachine().getLocation(),
                i.getMaintenancePoint() != null ? i.getMaintenancePoint().getId() : null,
                i.getMaintenancePoint() != null ? i.getMaintenancePoint().getOperationType().name() : null,
                i.getTechnician() != null ? i.getTechnician().getId() : null,
                i.getTechnician() != null ? i.getTechnician().getFullName() : null,
                i.getAssignedBy() != null ? i.getAssignedBy().getFullName() : null,
                i.getPlannedAt(),
                i.getExecutedAt(),
                i.getCompletedAt(),
                i.getValidatedAt(),
                i.getDurationMinutes(),
                i.getStatus(),
                i.getFindingStatus(),
                i.getObservations(),
                i.getEtatConstate(),
                i.getDocumentsJoints(),
                i.getTechnicianSignature(),
                i.getSupervisorValidation(),
                i.getCorrectionReport(),
                i.isUrgent(),
                i.getCreatedAt()
        );
    }
}
