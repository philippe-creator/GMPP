package com.gmpp.auth.dto;

import com.gmpp.user.Role;

public record AuthResponse(
        String token,
        Long id,
        String fullName,
        String email,
        Role role
) {}
