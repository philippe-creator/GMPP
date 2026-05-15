package com.gmpp.consumable;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ConsumableService {
    private final ConsumableRepository repo;

    public List<Consumable> findAll() { return repo.findAll(); }
    public List<Consumable> findLowStock() { return repo.findLowStock(); }

    public Consumable findById(Long id) {
        return repo.findById(id).orElseThrow(() -> new EntityNotFoundException("Consommable introuvable: " + id));
    }

    @Transactional
    public Consumable create(ConsumableRequest req) {
        return repo.save(Consumable.builder()
                .name(req.name()).reference(req.reference()).category(req.category())
                .unit(req.unit()).currentStock(req.currentStock()).minimumStock(req.minimumStock())
                .unitPrice(req.unitPrice()).supplier(req.supplier()).location(req.location()).build());
    }

    @Transactional
    public Consumable update(Long id, ConsumableRequest req) {
        Consumable c = findById(id);
        c.setName(req.name()); c.setReference(req.reference()); c.setCategory(req.category());
        c.setUnit(req.unit()); c.setCurrentStock(req.currentStock()); c.setMinimumStock(req.minimumStock());
        c.setUnitPrice(req.unitPrice()); c.setSupplier(req.supplier()); c.setLocation(req.location());
        return repo.save(c);
    }

    @Transactional
    public void deduct(Long id, double qty) {
        Consumable c = findById(id);
        double newStock = c.getCurrentStock() - qty;
        if (newStock < 0) throw new IllegalArgumentException("Stock insuffisant pour: " + c.getName());
        c.setCurrentStock(newStock);
        repo.save(c);
    }

    @Transactional
    public void addStock(Long id, double qty) {
        Consumable c = findById(id);
        c.setCurrentStock(c.getCurrentStock() + qty);
        repo.save(c);
    }

    @Transactional
    public void delete(Long id) { repo.deleteById(id); }
}
