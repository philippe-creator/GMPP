package com.gmpp.consumable;

import jakarta.validation.constraints.NotBlank;

public record ConsumableRequest(
        @NotBlank String name,
        String reference,
        String category,
        String unit,
        Double currentStock,
        Double minimumStock,
        Double unitPrice,
        String supplier,
        String location
) {}
