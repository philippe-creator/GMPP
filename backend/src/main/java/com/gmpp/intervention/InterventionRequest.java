package com.gmpp.intervention;

import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public record InterventionRequest(
        @NotNull Long machineId,
        Long maintenancePointId,
        Long technicianId,
        @NotNull LocalDateTime plannedAt,
        String observations,
        boolean urgent
) {}
