package com.gmpp.config;

import com.gmpp.consumable.*;
import com.gmpp.intervention.*;
import com.gmpp.machine.*;
import com.gmpp.maintenance.*;
import com.gmpp.user.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {
    private final UserRepository userRepository;
    private final MachineRepository machineRepository;
    private final MaintenancePointRepository maintenancePointRepository;
    private final InterventionRepository interventionRepository;
    private final ConsumableRepository consumableRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) return;

        AppUser admin = userRepository.save(AppUser.builder().fullName("Admin GMPP").employeeCode("ADM-001").email("admin@gmpp.local").password(passwordEncoder.encode("Admin123!")).role(Role.ADMIN).specialties("pilotage, securite").certifications("ISO 9001").active(true).build());
        AppUser manager = userRepository.save(AppUser.builder().fullName("Manager Maintenance").employeeCode("RSP-001").email("manager@gmpp.local").password(passwordEncoder.encode("Manager123!")).role(Role.RESPONSABLE_MAINTENANCE).specialties("mecanique, hydraulique").certifications("Lean Maintenance").active(true).build());
        AppUser chef = userRepository.save(AppUser.builder().fullName("Chef Equipe A").employeeCode("CHF-001").email("chef@gmpp.local").password(passwordEncoder.encode("Chef123!")).role(Role.CHEF_EQUIPE).specialties("electrique, pneumatique").certifications("Habilitation B2V").active(true).build());
        AppUser tech1 = userRepository.save(AppUser.builder().fullName("Technicien Atelier").employeeCode("TECH-001").email("tech@gmpp.local").password(passwordEncoder.encode("Tech123!")).role(Role.TECHNICIEN).specialties("hydraulique, pneumatique").certifications("Habilitation electrique").active(true).build());
        AppUser tech2 = userRepository.save(AppUser.builder().fullName("Technicien Mecanique").employeeCode("TECH-002").email("tech2@gmpp.local").password(passwordEncoder.encode("Tech123!")).role(Role.TECHNICIEN).specialties("mecanique, soudure").certifications("CACES 3").active(true).build());

        Machine m1 = machineRepository.save(Machine.builder().name("Presse hydraulique 1").machineType("HYDRAULIQUE").brand("Bosch Rexroth").model("RX-220").serialNumber("PH1-2026-0001").manufacturingYear(2021).commissioningDate(LocalDate.of(2022,3,15)).location("Atelier A - Ligne 1").status(MachineStatus.EN_SERVICE).operatingHours(7200L).build());
        Machine m2 = machineRepository.save(Machine.builder().name("Compresseur industriel").machineType("PNEUMATIQUE").brand("Atlas Copco").model("GA-37").serialNumber("CP2-2026-0002").manufacturingYear(2020).commissioningDate(LocalDate.of(2021,6,1)).location("Salle des machines").status(MachineStatus.EN_SERVICE).operatingHours(12500L).build());
        Machine m3 = machineRepository.save(Machine.builder().name("Tour CNC").machineType("USINAGE").brand("Mazak").model("QUICK TURN 200").serialNumber("CNC-2026-0003").manufacturingYear(2019).commissioningDate(LocalDate.of(2020,1,10)).location("Atelier B - Usinage").status(MachineStatus.EN_SERVICE).operatingHours(18000L).build());
        Machine m4 = machineRepository.save(Machine.builder().name("Convoyeur principal").machineType("MANUTENTION").brand("Interroll").model("RB-5000").serialNumber("CV4-2026-0004").manufacturingYear(2022).commissioningDate(LocalDate.of(2022,9,20)).location("Ligne de production").status(MachineStatus.EN_PANNE).operatingHours(3200L).build());

        MaintenancePoint pt1 = maintenancePointRepository.save(MaintenancePoint.builder().machine(m1).operationType(OperationType.GRAISSAGE).description("Graissage des coulisses et vérification pression").preciseLocation("Bloc coulissant avant").consumableType("Graisse lithium EP2").quantityRequired(120.0).quantityUnit("g").frequency(MaintenanceFrequency.HEBDOMADAIRE).nextPlannedDate(LocalDate.now().plusDays(2)).estimatedDurationMinutes(30).build());
        MaintenancePoint pt2 = maintenancePointRepository.save(MaintenancePoint.builder().machine(m1).operationType(OperationType.INSPECTION).description("Inspection des joints hydrauliques").preciseLocation("Circuit hydraulique").consumableType("Huile HV46").quantityRequired(5.0).quantityUnit("L").frequency(MaintenanceFrequency.MENSUELLE).nextPlannedDate(LocalDate.now().plusDays(15)).estimatedDurationMinutes(60).build());
        MaintenancePoint pt3 = maintenancePointRepository.save(MaintenancePoint.builder().machine(m2).operationType(OperationType.NETTOYAGE).description("Nettoyage filtres et purge condensats").preciseLocation("Filtre entrée").consumableType("Spray dégraissant").quantityRequired(1.0).quantityUnit("boîte").frequency(MaintenanceFrequency.HEBDOMADAIRE).nextPlannedDate(LocalDate.now().minusDays(2)).estimatedDurationMinutes(45).build());
        MaintenancePoint pt4 = maintenancePointRepository.save(MaintenancePoint.builder().machine(m3).operationType(OperationType.CALIBRATION).description("Calibration axes X, Y, Z").preciseLocation("Tête de coupe").frequency(MaintenanceFrequency.TRIMESTRIELLE).nextPlannedDate(LocalDate.now().plusDays(30)).estimatedDurationMinutes(120).build());

        interventionRepository.save(Intervention.builder().machine(m1).maintenancePoint(pt1).technician(tech1).assignedBy(manager).plannedAt(LocalDateTime.now().plusDays(2)).status(InterventionStatus.PLANIFIEE).findingStatus(FindingStatus.NORMAL).observations("Contrôle initial programmé").build());
        interventionRepository.save(Intervention.builder().machine(m2).maintenancePoint(pt3).technician(tech2).assignedBy(chef).plannedAt(LocalDateTime.now().minusDays(2)).status(InterventionStatus.EN_RETARD).findingStatus(FindingStatus.NORMAL).observations("Nettoyage en retard").urgent(true).build());
        interventionRepository.save(Intervention.builder().machine(m1).maintenancePoint(pt2).technician(tech1).assignedBy(manager).plannedAt(LocalDateTime.now().minusDays(8)).executedAt(LocalDateTime.now().minusDays(8).plusMinutes(10)).completedAt(LocalDateTime.now().minusDays(8).plusMinutes(55)).durationMinutes(45).status(InterventionStatus.VALIDEE).findingStatus(FindingStatus.USURE_DETECTEE).observations("Usure légère sur joints").technicianSignature(tech1.getFullName()).supervisorValidation(manager.getFullName()).build());
        interventionRepository.save(Intervention.builder().machine(m3).maintenancePoint(pt4).technician(tech2).assignedBy(manager).plannedAt(LocalDateTime.now().plusDays(30)).status(InterventionStatus.PLANIFIEE).findingStatus(FindingStatus.NORMAL).build());
        interventionRepository.save(Intervention.builder().machine(m4).technician(tech1).assignedBy(chef).plannedAt(LocalDateTime.now().minusDays(1)).executedAt(LocalDateTime.now().minusDays(1)).status(InterventionStatus.EN_COURS).findingStatus(FindingStatus.ANOMALIE_TROUVEE).observations("Anomalie sur courroie").urgent(true).build());

        consumableRepository.save(Consumable.builder().name("Graisse lithium EP2").reference("GR-EP2-001").category("Lubrifiants").unit("kg").currentStock(5.5).minimumStock(2.0).unitPrice(18.50).supplier("TotalEnergies").location("Stockage A1").build());
        consumableRepository.save(Consumable.builder().name("Huile hydraulique HV46").reference("HH-46-001").category("Lubrifiants").unit("L").currentStock(1.5).minimumStock(5.0).unitPrice(8.20).supplier("Shell Lubricants").location("Stockage A2").build());
        consumableRepository.save(Consumable.builder().name("Filtre air compresseur").reference("FA-AC-001").category("Filtres").unit("pièce").currentStock(12.0).minimumStock(5.0).unitPrice(45.00).supplier("Atlas Copco").location("Stockage B1").build());
        consumableRepository.save(Consumable.builder().name("Joint torique 40x3").reference("JT-40x3").category("Joints").unit("pièce").currentStock(3.0).minimumStock(10.0).unitPrice(1.20).supplier("Parker Hannifin").location("Stockage C1").build());
    }
}
