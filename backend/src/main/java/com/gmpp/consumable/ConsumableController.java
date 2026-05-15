package com.gmpp.consumable;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/consumables")
@RequiredArgsConstructor
public class ConsumableController {
    private final ConsumableService service;

    @GetMapping
    public List<Consumable> findAll() { return service.findAll(); }

    @GetMapping("/low-stock")
    public List<Consumable> lowStock() { return service.findLowStock(); }

    @GetMapping("/{id}")
    public Consumable findById(@PathVariable Long id) { return service.findById(id); }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAnyRole('ADMIN','RESPONSABLE_MAINTENANCE')")
    public Consumable create(@Valid @RequestBody ConsumableRequest req) { return service.create(req); }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','RESPONSABLE_MAINTENANCE')")
    public Consumable update(@PathVariable Long id, @Valid @RequestBody ConsumableRequest req) {
        return service.update(id, req);
    }

    @PatchMapping("/{id}/deduct")
    @PreAuthorize("hasAnyRole('ADMIN','RESPONSABLE_MAINTENANCE','CHEF_EQUIPE','TECHNICIEN')")
    public void deduct(@PathVariable Long id, @RequestParam double qty) { service.deduct(id, qty); }

    @PatchMapping("/{id}/add-stock")
    @PreAuthorize("hasAnyRole('ADMIN','RESPONSABLE_MAINTENANCE')")
    public void addStock(@PathVariable Long id, @RequestParam double qty) { service.addStock(id, qty); }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasRole('ADMIN')")
    public void delete(@PathVariable Long id) { service.delete(id); }
}
