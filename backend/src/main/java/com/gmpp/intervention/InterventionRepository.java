package com.gmpp.intervention;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface InterventionRepository extends JpaRepository<Intervention, Long> {
    Long countByStatus(InterventionStatus status);
    List<Intervention> findByStatus(InterventionStatus status);
    List<Intervention> findByMachineId(Long machineId);
    List<Intervention> findByTechnicianId(Long technicianId);
    List<Intervention> findByPlannedAtBetween(LocalDateTime start, LocalDateTime end);

    @Query("SELECT i FROM Intervention i WHERE i.plannedAt BETWEEN :start AND :end ORDER BY i.plannedAt ASC")
    List<Intervention> findByDateRange(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    @Query("SELECT i FROM Intervention i WHERE i.technician.id = :techId AND i.plannedAt BETWEEN :start AND :end")
    List<Intervention> findByTechnicianAndDateRange(
            @Param("techId") Long techId,
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end);

    @Query("SELECT i FROM Intervention i WHERE i.status = 'PLANIFIEE' AND i.plannedAt < :now")
    List<Intervention> findOverdue(@Param("now") LocalDateTime now);

    List<Intervention> findByMaintenancePointId(Long pointId);
}
