package com.gmpp.user;

import java.time.LocalDateTime;

public record UserResponse(
        Long id,
        String fullName,
        String employeeCode,
        String email,
        Role role,
        String specialties,
        String certifications,
        boolean active,
        String phone,
        String department,
        LocalDateTime lastLogin
) {
    public static UserResponse from(AppUser u) {
        return new UserResponse(u.getId(), u.getFullName(), u.getEmployeeCode(),
                u.getEmail(), u.getRole(), u.getSpecialties(), u.getCertifications(),
                u.isActive(), u.getPhone(), u.getDepartment(), u.getLastLogin());
    }
}
