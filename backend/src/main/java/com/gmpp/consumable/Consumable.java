package com.gmpp.consumable;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "consumables")
@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class Consumable {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    private String name;
    private String reference;
    private String category;
    private String unit;
    private Double currentStock;
    private Double minimumStock;
    private Double unitPrice;
    private String supplier;
    private String location;
    private LocalDateTime createdAt;
    @PrePersist void prePersist() { createdAt = LocalDateTime.now(); }
}
