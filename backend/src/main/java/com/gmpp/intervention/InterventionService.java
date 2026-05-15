package com.gmpp.intervention;

import com.gmpp.machine.Machine;
import com.gmpp.machine.MachineRepository;
import com.gmpp.machine.MachineStatus;
import com.gmpp.maintenance.MaintenancePoint;
import com.gmpp.maintenance.MaintenancePointRepository;
import com.gmpp.maintenance.MaintenancePointService;
import com.gmpp.user.AppUser;
import com.gmpp.user.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
@RequiredArgsConstructor
public class InterventionService {

    private final InterventionRepository interventionRepository;
    private final MachineRepository machineRepository;
    private final MaintenancePointRepository maintenancePointRepository;
    private final UserRepository userRepository;
    private final MaintenancePointService maintenancePointService;

    public List<Intervention> findAll() { return interventionRepository.findAll(); }

    public Intervention findById(Long id) {
        return interventionRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Intervention introuvable: " + id));
    }

    public List<Intervention> findByMachine(Long machineId) { return interventionRepository.findByMachineId(machineId); }
    public List<Intervention> findByTechnician(Long techId) { return interventionRepository.findByTechnicianId(techId); }

    public List<Intervention> findBetween(LocalDate start, LocalDate end) {
        return interventionRepository.findByPlannedAtBetween(start.atStartOfDay(), end.plusDays(1).atStartOfDay());
    }

    public List<Intervention> findByDateRange(LocalDateTime start, LocalDateTime end) {
        return interventionRepository.findByDateRange(start, end);
    }

    @Transactional
    public Intervention create(InterventionRequest req, String creatorEmail) {
        Machine machine = machineRepository.findById(req.machineId())
                .orElseThrow(() -> new EntityNotFoundException("Machine introuvable: " + req.machineId()));
        MaintenancePoint point = req.maintenancePointId() != null ? maintenancePointRepository.findById(req.maintenancePointId()).orElse(null) : null;
        AppUser technician = req.technicianId() != null ? userRepository.findById(req.technicianId()).orElse(null) : null;
        AppUser creator = userRepository.findByEmail(creatorEmail).orElse(null);

        return interventionRepository.save(Intervention.builder()
                .machine(machine).maintenancePoint(point).technician(technician).assignedBy(creator)
                .plannedAt(req.plannedAt()).status(InterventionStatus.PLANIFIEE)
                .findingStatus(FindingStatus.NORMAL).observations(req.observations()).urgent(req.urgent()).build());
    }

    @Transactional
    public Intervention assignTechnician(Long id, Long technicianId) {
        Intervention i = findById(id);
        AppUser tech = userRepository.findById(technicianId)
                .orElseThrow(() -> new EntityNotFoundException("Technicien introuvable: " + technicianId));
        i.setTechnician(tech);
        return interventionRepository.save(i);
    }

    @Transactional
    public Intervention start(Long id) {
        Intervention i = findById(id);
        if (i.getStatus() != InterventionStatus.PLANIFIEE && i.getStatus() != InterventionStatus.EN_PAUSE && i.getStatus() != InterventionStatus.EN_RETARD)
            throw new IllegalStateException("Impossible de démarrer: statut " + i.getStatus());
        i.setStatus(InterventionStatus.EN_COURS);
        if (i.getExecutedAt() == null) i.setExecutedAt(LocalDateTime.now());
        Machine m = i.getMachine(); m.setStatus(MachineStatus.EN_MAINTENANCE); machineRepository.save(m);
        return interventionRepository.save(i);
    }

    @Transactional
    public Intervention pause(Long id) {
        Intervention i = findById(id);
        if (i.getStatus() != InterventionStatus.EN_COURS)
            throw new IllegalStateException("Impossible de mettre en pause: statut " + i.getStatus());
        i.setStatus(InterventionStatus.EN_PAUSE);
        return interventionRepository.save(i);
    }

    @Transactional
    public Intervention complete(Long id, CompleteInterventionRequest req) {
        Intervention i = findById(id);
        if (i.getStatus() != InterventionStatus.EN_COURS && i.getStatus() != InterventionStatus.EN_PAUSE)
            throw new IllegalStateException("Impossible de terminer: statut " + i.getStatus());
        LocalDateTime now = LocalDateTime.now();
        i.setStatus(InterventionStatus.TERMINEE);
        i.setCompletedAt(now);
        i.setObservations(req.observations());
        i.setEtatConstate(req.etatConstate());
        i.setFindingStatus(req.findingStatus() != null ? req.findingStatus() : FindingStatus.NORMAL);
        i.setTechnicianSignature(req.technicianSignature());
        i.setCorrectionReport(req.correctionReport());
        if (req.documentsJoints() != null) i.setDocumentsJoints(req.documentsJoints());
        if (req.photos() != null) i.setPhotos(req.photos());
        if (i.getExecutedAt() != null) i.setDurationMinutes((int) ChronoUnit.MINUTES.between(i.getExecutedAt(), now));
        Machine m = i.getMachine(); m.setStatus(MachineStatus.EN_SERVICE); machineRepository.save(m);
        if (i.getMaintenancePoint() != null) maintenancePointService.markExecuted(i.getMaintenancePoint().getId());
        return interventionRepository.save(i);
    }

    @Transactional
    public Intervention addPhoto(Long id, String photoPath) {
        Intervention i = findById(id);
        if (!i.getPhotos().contains(photoPath)) {
            i.getPhotos().add(photoPath);
        }
        return interventionRepository.save(i);
    }

    @Transactional
    public Intervention validate(Long id, String validatorName) {
        Intervention i = findById(id);
        if (i.getStatus() != InterventionStatus.TERMINEE)
            throw new IllegalStateException("Seule une intervention terminée peut être validée");
        i.setStatus(InterventionStatus.VALIDEE);
        i.setValidatedAt(LocalDateTime.now());
        i.setSupervisorValidation(validatorName);
        return interventionRepository.save(i);
    }

    @Transactional
    public Intervention cancel(Long id) {
        Intervention i = findById(id);
        i.setStatus(InterventionStatus.ANNULEE);
        return interventionRepository.save(i);
    }

    @Transactional
    public Intervention update(Long id, InterventionRequest req) {
        Intervention i = findById(id);
        i.setPlannedAt(req.plannedAt());
        i.setObservations(req.observations());
        i.setUrgent(req.urgent());
        if (req.technicianId() != null) i.setTechnician(userRepository.findById(req.technicianId()).orElse(null));
        return interventionRepository.save(i);
    }

    @Transactional
    public void delete(Long id) { findById(id); interventionRepository.deleteById(id); }
}
