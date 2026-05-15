package com.gmpp.intervention;

import com.gmpp.machine.Machine;
import com.gmpp.maintenance.MaintenancePoint;
import com.gmpp.user.AppUser;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "interventions")
@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class Intervention {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "machine_id", nullable = false)
    private Machine machine;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "point_maintenance_id")
    private MaintenancePoint maintenancePoint;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "technician_id")
    private AppUser technician;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_by_id")
    private AppUser assignedBy;

    @Column(nullable = false)
    private LocalDateTime plannedAt;

    private LocalDateTime executedAt;
    private LocalDateTime completedAt;
    private LocalDateTime validatedAt;

    private Integer durationMinutes;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private InterventionStatus status = InterventionStatus.PLANIFIEE;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private FindingStatus findingStatus = FindingStatus.NORMAL;

    @Column(columnDefinition = "TEXT")
    private String observations;

    @Column(columnDefinition = "TEXT")
    private String etatConstate;

    @ElementCollection
    @CollectionTable(name = "intervention_documents", joinColumns = @JoinColumn(name = "intervention_id"))
    @Column(name = "document_path")
    @Builder.Default
    private List<String> documentsJoints = new ArrayList<>();

    private String technicianSignature;
    private String supervisorValidation;

    @Column(columnDefinition = "TEXT")
    private String correctionReport;

    private boolean urgent;

    @ElementCollection
    @CollectionTable(name = "intervention_photos", joinColumns = @JoinColumn(name = "intervention_id"))
    @Column(name = "photo_path")
    @Builder.Default
    private List<String> photos = new ArrayList<>();

    private LocalDateTime createdAt = LocalDateTime.now();
}
