package com.gmpp.auth.dto;

import com.gmpp.user.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record RegisterRequest(
        @NotBlank String fullName,
        @NotBlank String employeeCode,
        @Email @NotBlank String email,
        @NotBlank String password,
        @NotNull Role role,
        String specialties,
        String certifications,
        boolean active
) {
}

