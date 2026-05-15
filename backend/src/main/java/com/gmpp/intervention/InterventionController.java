package com.gmpp.intervention;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/interventions")
@RequiredArgsConstructor
public class InterventionController {

    private final InterventionService service;

    @GetMapping
    public List<InterventionResponse> findAll(@AuthenticationPrincipal UserDetails user) {
        // Si l'utilisateur est un technicien, retourner uniquement ses interventions
        if (user != null && user.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_TECHNICIEN"))) {
            Long technicianId = Long.parseLong(user.getUsername());
            return service.findByTechnician(technicianId).stream().map(InterventionResponse::from).toList();
        }
        return service.findAll().stream().map(InterventionResponse::from).toList();
    }

    @GetMapping("/{id}")
    public InterventionResponse findById(@PathVariable Long id) {
        return InterventionResponse.from(service.findById(id));
    }

    @GetMapping("/machine/{machineId}")
    public List<InterventionResponse> findByMachine(@PathVariable Long machineId) {
        return service.findByMachine(machineId).stream().map(InterventionResponse::from).toList();
    }

    @GetMapping("/technician/{techId}")
    public List<InterventionResponse> findByTechnician(@PathVariable Long techId) {
        return service.findByTechnician(techId).stream().map(InterventionResponse::from).toList();
    }

    @GetMapping("/planning")
    public List<InterventionResponse> findByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {
        return service.findByDateRange(start, end).stream().map(InterventionResponse::from).toList();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAnyRole('ADMIN','RESPONSABLE_MAINTENANCE','CHEF_EQUIPE')")
    public InterventionResponse create(@Valid @RequestBody InterventionRequest req,
                                       @AuthenticationPrincipal UserDetails user) {
        return InterventionResponse.from(service.create(req, user.getUsername()));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','RESPONSABLE_MAINTENANCE','CHEF_EQUIPE')")
    public InterventionResponse update(@PathVariable Long id, @Valid @RequestBody InterventionRequest req,
                                       @AuthenticationPrincipal UserDetails user) {
        return InterventionResponse.from(service.update(id, req));
    }

    @PatchMapping("/{id}/assign")
    @PreAuthorize("hasAnyRole('ADMIN','RESPONSABLE_MAINTENANCE','CHEF_EQUIPE')")
    public InterventionResponse assign(@PathVariable Long id, @RequestParam Long technicianId) {
        return InterventionResponse.from(service.assignTechnician(id, technicianId));
    }

    @PatchMapping("/{id}/start")
    @PreAuthorize("hasAnyRole('TECHNICIEN','CHEF_EQUIPE','RESPONSABLE_MAINTENANCE','ADMIN')")
    public InterventionResponse start(@PathVariable Long id) {
        return InterventionResponse.from(service.start(id));
    }

    @PatchMapping("/{id}/pause")
    @PreAuthorize("hasAnyRole('TECHNICIEN','CHEF_EQUIPE','RESPONSABLE_MAINTENANCE','ADMIN')")
    public InterventionResponse pause(@PathVariable Long id) {
        return InterventionResponse.from(service.pause(id));
    }

    @PatchMapping("/{id}/complete")
    @PreAuthorize("hasAnyRole('TECHNICIEN','CHEF_EQUIPE','RESPONSABLE_MAINTENANCE','ADMIN')")
    public InterventionResponse complete(@PathVariable Long id,
                                         @RequestBody CompleteInterventionRequest req) {
        return InterventionResponse.from(service.complete(id, req));
    }

    @PatchMapping("/{id}/validate")
    @PreAuthorize("hasAnyRole('RESPONSABLE_MAINTENANCE','ADMIN')")
    public InterventionResponse validate(@PathVariable Long id,
                                         @AuthenticationPrincipal UserDetails user) {
        return InterventionResponse.from(service.validate(id, user.getUsername()));
    }

    @PatchMapping("/{id}/cancel")
    @PreAuthorize("hasAnyRole('RESPONSABLE_MAINTENANCE','ADMIN')")
    public InterventionResponse cancel(@PathVariable Long id) {
        return InterventionResponse.from(service.cancel(id));
    }

    @PostMapping("/{id}/photos")
    @PreAuthorize("hasAnyRole('TECHNICIEN','CHEF_EQUIPE','RESPONSABLE_MAINTENANCE','ADMIN')")
    public InterventionResponse addPhoto(@PathVariable Long id, @RequestBody String photoPath) {
        return InterventionResponse.from(service.addPhoto(id, photoPath));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasRole('ADMIN')")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
