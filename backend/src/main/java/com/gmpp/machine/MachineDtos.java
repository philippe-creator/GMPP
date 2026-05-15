package com.gmpp.machine;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class MachineDtos {

    public record MachineRequest(
            @NotBlank String name,
            String machineType,
            String brand,
            String model,
            String serialNumber,
            Integer manufacturingYear,
            LocalDate commissioningDate,
            String location,
            MachineStatus status,
            Long operatingHours,
            String description
    ) {}

    public record MachineResponse(
            Long id,
            String name,
            String machineType,
            String brand,
            String model,
            String serialNumber,
            Integer manufacturingYear,
            LocalDate commissioningDate,
            String location,
            MachineStatus status,
            Long operatingHours,
            String description,
            LocalDateTime createdAt
    ) {
        public static MachineResponse from(Machine m) {
            return new MachineResponse(m.getId(), m.getName(), m.getMachineType(),
                    m.getBrand(), m.getModel(), m.getSerialNumber(), m.getManufacturingYear(),
                    m.getCommissioningDate(), m.getLocation(), m.getStatus(),
                    m.getOperatingHours(), m.getDescription(), m.getCreatedAt());
        }
    }
}
