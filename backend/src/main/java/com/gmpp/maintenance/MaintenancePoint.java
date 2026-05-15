package com.gmpp.maintenance;

import com.gmpp.machine.Machine;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "points_maintenance")
@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class MaintenancePoint {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "machine_id", nullable = false)
    private Machine machine;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OperationType operationType;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String preciseLocation;
    private String consumableType;
    private Double quantityRequired;
    private String quantityUnit;

    @Enumerated(EnumType.STRING)
    private MaintenanceFrequency frequency;

    private Integer counterThreshold;

    private LocalDate nextPlannedDate;
    private LocalDate lastExecutedDate;

    @Builder.Default
    private boolean active = true;

    private Integer estimatedDurationMinutes;

    @Column(columnDefinition = "TEXT")
    private String instructions;

    private LocalDateTime createdAt = LocalDateTime.now();
}
