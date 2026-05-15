package com.gmpp.machine;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "machines")
@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class Machine {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String machineType;
    private String brand;
    private String model;

    @Column(unique = true)
    private String serialNumber;

    private Integer manufacturingYear;
    private LocalDate commissioningDate;
    private String location;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private MachineStatus status = MachineStatus.EN_SERVICE;

    @Builder.Default
    private Long operatingHours = 0L;

    private String description;
    private String image;

    @Column(unique = true)
    private String qrCode;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt;

    @PreUpdate
    void onUpdate() { this.updatedAt = LocalDateTime.now(); }
}
