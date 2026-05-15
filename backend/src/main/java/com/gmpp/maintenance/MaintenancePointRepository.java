package com.gmpp.maintenance;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface MaintenancePointRepository extends JpaRepository<MaintenancePoint, Long> {
    List<MaintenancePoint> findByMachineId(Long machineId);
    List<MaintenancePoint> findByNextPlannedDateLessThanEqual(LocalDate date);
    List<MaintenancePoint> findByNextPlannedDateBetween(LocalDate start, LocalDate end);

    @Query("SELECT p FROM MaintenancePoint p WHERE p.active = true AND p.nextPlannedDate <= :today")
    List<MaintenancePoint> findOverdue(@Param("today") LocalDate today);

    @Query("SELECT p FROM MaintenancePoint p WHERE p.active = true AND p.nextPlannedDate BETWEEN :start AND :end")
    List<MaintenancePoint> findUpcoming(@Param("start") LocalDate start, @Param("end") LocalDate end);
}
