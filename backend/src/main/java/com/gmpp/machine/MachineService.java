package com.gmpp.machine;

import com.gmpp.machine.MachineDtos.MachineRequest;
import com.gmpp.machine.MachineDtos.MachineResponse;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class MachineService {

    private final MachineRepository machineRepository;

    public List<Machine> findAll() {
        return machineRepository.findAllOrderByCreatedAtDesc();
    }

    public Machine findById(Long id) {
        return machineRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Machine introuvable: " + id));
    }

    @Transactional
    public Machine create(MachineRequest req) {
        if (req.serialNumber() != null && machineRepository.existsBySerialNumber(req.serialNumber())) {
            throw new IllegalArgumentException("Numéro de série déjà utilisé: " + req.serialNumber());
        }
        String qrCode = generateUniqueQrCode();
        Machine m = Machine.builder()
                .name(req.name())
                .machineType(req.machineType())
                .brand(req.brand())
                .model(req.model())
                .serialNumber(req.serialNumber())
                .manufacturingYear(req.manufacturingYear())
                .commissioningDate(req.commissioningDate())
                .location(req.location())
                .status(req.status() != null ? req.status() : MachineStatus.EN_SERVICE)
                .operatingHours(req.operatingHours() != null ? req.operatingHours() : 0L)
                .qrCode(qrCode)
                .description(req.description())
                .build();
        return machineRepository.save(m);
    }

    public Machine findByQrCode(String qrCode) {
        return machineRepository.findByQrCode(qrCode)
                .orElseThrow(() -> new EntityNotFoundException("Machine introuvable avec QR code: " + qrCode));
    }

    private String generateUniqueQrCode() {
        String qrCode;
        do {
            qrCode = "GMPP-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        } while (machineRepository.existsByQrCode(qrCode));
        return qrCode;
    }

    @Transactional
    public Machine update(Long id, MachineRequest req) {
        Machine m = findById(id);
        m.setName(req.name());
        m.setMachineType(req.machineType());
        m.setBrand(req.brand());
        m.setModel(req.model());
        m.setLocation(req.location());
        m.setStatus(req.status() != null ? req.status() : m.getStatus());
        m.setOperatingHours(req.operatingHours() != null ? req.operatingHours() : m.getOperatingHours());
        m.setDescription(req.description());
        m.setUpdatedAt(LocalDateTime.now());
        return machineRepository.save(m);
    }

    @Transactional
    public void updateStatus(Long id, MachineStatus status) {
        Machine m = findById(id);
        m.setStatus(status);
        m.setUpdatedAt(LocalDateTime.now());
        machineRepository.save(m);
    }

    @Transactional
    public void delete(Long id) {
        findById(id);
        machineRepository.deleteById(id);
    }

    @Transactional
    public void incrementHours(Long id, long hours) {
        Machine m = findById(id);
        m.setOperatingHours(m.getOperatingHours() + hours);
        machineRepository.save(m);
    }
}
