package com.gmpp.user;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record UpdateUserRequest(
        @NotBlank String fullName,
        @Email @NotBlank String email,
        @NotNull Role role,
        String specialties,
        String certifications,
        String phone,
        String department,
        boolean active
) {}
