package com.gmpp.user;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<AppUser, Long> {
    Optional<AppUser> findByEmail(String email);
    boolean existsByEmail(String email);
    boolean existsByEmployeeCode(String employeeCode);
    List<AppUser> findByRole(Role role);
    List<AppUser> findByActiveTrue();
    List<AppUser> findByRoleIn(List<Role> roles);

    @Query("SELECT u FROM AppUser u WHERE u.active = true AND u.role IN ('TECHNICIEN', 'CHEF_EQUIPE')")
    List<AppUser> findActiveTechnicians();
}
