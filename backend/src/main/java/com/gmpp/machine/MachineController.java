package com.gmpp.machine;

import com.gmpp.machine.MachineDtos.MachineRequest;
import com.gmpp.machine.MachineDtos.MachineResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/machines")
@RequiredArgsConstructor
public class MachineController {

    private final MachineService machineService;

    @GetMapping
    public List<MachineResponse> findAll() {
        return machineService.findAll().stream().map(MachineResponse::from).toList();
    }

    @GetMapping("/{id}")
    public MachineResponse findById(@PathVariable Long id) {
        return MachineResponse.from(machineService.findById(id));
    }

    @GetMapping("/qr/{qrCode}")
    public MachineResponse findByQrCode(@PathVariable String qrCode) {
        return MachineResponse.from(machineService.findByQrCode(qrCode));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAnyRole('ADMIN','RESPONSABLE_MAINTENANCE')")
    public MachineResponse create(@Valid @RequestBody MachineRequest req) {
        return MachineResponse.from(machineService.create(req));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','RESPONSABLE_MAINTENANCE')")
    public MachineResponse update(@PathVariable Long id, @Valid @RequestBody MachineRequest req) {
        return MachineResponse.from(machineService.update(id, req));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN','RESPONSABLE_MAINTENANCE')")
    public void updateStatus(@PathVariable Long id, @RequestParam MachineStatus status) {
        machineService.updateStatus(id, status);
    }

    @PatchMapping("/{id}/hours")
    @PreAuthorize("hasAnyRole('ADMIN','RESPONSABLE_MAINTENANCE','CHEF_EQUIPE')")
    public void addHours(@PathVariable Long id, @RequestParam long hours) {
        machineService.incrementHours(id, hours);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasRole('ADMIN')")
    public void delete(@PathVariable Long id) {
        machineService.delete(id);
    }
}
