package com.gmpp.maintenance;

import com.gmpp.machine.Machine;
import com.gmpp.machine.MachineRepository;
import com.gmpp.maintenance.MaintenancePointDtos.MaintenancePointRequest;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MaintenancePointService {

    private final MaintenancePointRepository repo;
    private final MachineRepository machineRepository;

    public List<MaintenancePoint> findAll() {
        return repo.findAll();
    }

    public List<MaintenancePoint> findByMachine(Long machineId) {
        return repo.findByMachineId(machineId);
    }

    public MaintenancePoint findById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Point de maintenance introuvable: " + id));
    }

    public List<MaintenancePoint> findOverdue() {
        return repo.findOverdue(LocalDate.now());
    }

    public List<MaintenancePoint> findUpcoming(int days) {
        return repo.findUpcoming(LocalDate.now(), LocalDate.now().plusDays(days));
    }

    @Transactional
    public MaintenancePoint create(MaintenancePointRequest req) {
        Machine machine = machineRepository.findById(req.machineId())
                .orElseThrow(() -> new EntityNotFoundException("Machine introuvable: " + req.machineId()));

        LocalDate nextDate = req.nextPlannedDate() != null
                ? req.nextPlannedDate()
                : calculateNextDate(req.frequency());

        MaintenancePoint point = MaintenancePoint.builder()
                .machine(machine)
                .operationType(req.operationType())
                .description(req.description())
                .preciseLocation(req.preciseLocation())
                .consumableType(req.consumableType())
                .quantityRequired(req.quantityRequired())
                .quantityUnit(req.quantityUnit())
                .frequency(req.frequency())
                .counterThreshold(req.counterThreshold())
                .nextPlannedDate(nextDate)
                .estimatedDurationMinutes(req.estimatedDurationMinutes())
                .instructions(req.instructions())
                .build();
        return repo.save(point);
    }

    @Transactional
    public MaintenancePoint update(Long id, MaintenancePointRequest req) {
        MaintenancePoint p = findById(id);
        p.setOperationType(req.operationType());
        p.setDescription(req.description());
        p.setPreciseLocation(req.preciseLocation());
        p.setConsumableType(req.consumableType());
        p.setQuantityRequired(req.quantityRequired());
        p.setQuantityUnit(req.quantityUnit());
        p.setFrequency(req.frequency());
        p.setCounterThreshold(req.counterThreshold());
        if (req.nextPlannedDate() != null) p.setNextPlannedDate(req.nextPlannedDate());
        p.setEstimatedDurationMinutes(req.estimatedDurationMinutes());
        p.setInstructions(req.instructions());
        return repo.save(p);
    }

    @Transactional
    public void markExecuted(Long id) {
        MaintenancePoint p = findById(id);
        p.setLastExecutedDate(LocalDate.now());
        p.setNextPlannedDate(calculateNextDate(p.getFrequency()));
        repo.save(p);
    }

    @Transactional
    public void delete(Long id) {
        findById(id);
        repo.deleteById(id);
    }

    private LocalDate calculateNextDate(MaintenanceFrequency frequency) {
        if (frequency == null) return LocalDate.now().plusMonths(1);
        return switch (frequency) {
            case QUOTIDIENNE -> LocalDate.now().plusDays(1);
            case HEBDOMADAIRE -> LocalDate.now().plusWeeks(1);
            case BIMENSUELLE -> LocalDate.now().plusWeeks(2);
            case MENSUELLE -> LocalDate.now().plusMonths(1);
            case TRIMESTRIELLE -> LocalDate.now().plusMonths(3);
            case SEMESTRIELLE -> LocalDate.now().plusMonths(6);
            case ANNUELLE -> LocalDate.now().plusYears(1);
            default -> LocalDate.now().plusMonths(1);
        };
    }
}
