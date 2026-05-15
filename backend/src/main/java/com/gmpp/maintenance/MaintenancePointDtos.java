package com.gmpp.maintenance;

import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public class MaintenancePointDtos {

    public record MaintenancePointRequest(
            @NotNull Long machineId,
            @NotNull OperationType operationType,
            String description,
            String preciseLocation,
            String consumableType,
            Double quantityRequired,
            String quantityUnit,
            MaintenanceFrequency frequency,
            Integer counterThreshold,
            LocalDate nextPlannedDate,
            Integer estimatedDurationMinutes,
            String instructions
    ) {}

    public record MaintenancePointResponse(
            Long id,
            Long machineId,
            String machineName,
            OperationType operationType,
            String description,
            String preciseLocation,
            String consumableType,
            Double quantityRequired,
            String quantityUnit,
            MaintenanceFrequency frequency,
            LocalDate nextPlannedDate,
            LocalDate lastExecutedDate,
            boolean active,
            Integer estimatedDurationMinutes,
            String instructions
    ) {
        public static MaintenancePointResponse from(MaintenancePoint p) {
            return new MaintenancePointResponse(
                    p.getId(),
                    p.getMachine().getId(),
                    p.getMachine().getName(),
                    p.getOperationType(),
                    p.getDescription(),
                    p.getPreciseLocation(),
                    p.getConsumableType(),
                    p.getQuantityRequired(),
                    p.getQuantityUnit(),
                    p.getFrequency(),
                    p.getNextPlannedDate(),
                    p.getLastExecutedDate(),
                    p.isActive(),
                    p.getEstimatedDurationMinutes(),
                    p.getInstructions()
            );
        }
    }
}
