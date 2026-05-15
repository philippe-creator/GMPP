package com.gmpp.consumable;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface ConsumableRepository extends JpaRepository<Consumable, Long> {
    @Query("SELECT c FROM Consumable c WHERE c.currentStock <= c.minimumStock")
    List<Consumable> findLowStock();
    List<Consumable> findByCategory(String category);
}
