package com.gmpp.maintenance;

import com.gmpp.maintenance.MaintenancePointDtos.MaintenancePointRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/maintenance-points")
@RequiredArgsConstructor
public class MaintenancePointController {

    private final MaintenancePointService service;

    @GetMapping
    public List<MaintenancePointResponse> findAll() {
        return service.findAll().stream().map(MaintenancePointResponse::from).toList();
    }

    @GetMapping("/{id}")
    public MaintenancePointResponse findById(@PathVariable Long id) {
        return MaintenancePointResponse.from(service.findById(id));
    }

    @GetMapping("/machine/{machineId}")
    public List<MaintenancePointResponse> findByMachine(@PathVariable Long machineId) {
        return service.findByMachine(machineId).stream().map(MaintenancePointResponse::from).toList();
    }

    @GetMapping("/overdue")
    public List<MaintenancePointResponse> findOverdue() {
        return service.findOverdue().stream().map(MaintenancePointResponse::from).toList();
    }

    @GetMapping("/upcoming")
    public List<MaintenancePointResponse> findUpcoming(@RequestParam(defaultValue = "7") int days) {
        return service.findUpcoming(days).stream().map(MaintenancePointResponse::from).toList();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAnyRole('ADMIN','RESPONSABLE_MAINTENANCE')")
    public MaintenancePointResponse create(@Valid @RequestBody MaintenancePointRequest req) {
        return MaintenancePointResponse.from(service.create(req));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','RESPONSABLE_MAINTENANCE')")
    public MaintenancePointResponse update(@PathVariable Long id, @Valid @RequestBody MaintenancePointRequest req) {
        return MaintenancePointResponse.from(service.update(id, req));
    }

    @PatchMapping("/{id}/execute")
    @PreAuthorize("hasAnyRole('ADMIN','RESPONSABLE_MAINTENANCE','CHEF_EQUIPE','TECHNICIEN')")
    public void markExecuted(@PathVariable Long id) {
        service.markExecuted(id);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasAnyRole('ADMIN','RESPONSABLE_MAINTENANCE')")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
