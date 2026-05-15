package com.gmpp.audit;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "audit_logs")
@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class AuditLog {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String userEmail;
    private String action;
    private String entityType;
    private Long entityId;
    @Column(columnDefinition = "TEXT")
    private String details;
    private LocalDateTime performedAt;

    @PrePersist
    void prePersist() { this.performedAt = LocalDateTime.now(); }
}
