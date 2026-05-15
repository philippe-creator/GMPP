package com.gmpp.machine;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface MachineRepository extends JpaRepository<Machine, Long> {
    long countByStatus(MachineStatus status);
    List<Machine> findByStatus(MachineStatus status);
    boolean existsBySerialNumber(String serialNumber);
    boolean existsByQrCode(String qrCode);

    @Query("SELECT m FROM Machine m ORDER BY m.createdAt DESC")
    List<Machine> findAllOrderByCreatedAtDesc();

    java.util.Optional<Machine> findByQrCode(String qrCode);
}
