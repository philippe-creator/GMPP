package com.gmpp.dashboard;

import com.gmpp.intervention.InterventionResponse;
import com.gmpp.intervention.InterventionService;
import com.gmpp.maintenance.MaintenancePointResponse;
import com.gmpp.maintenance.MaintenancePointService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/alerts")
@RequiredArgsConstructor
public class AlertsController {

    private final InterventionService interventionService;
    private final MaintenancePointService maintenancePointService;

    @GetMapping("/upcoming-interventions")
    public List<InterventionResponse> getUpcomingInterventions() {
        return interventionService.findBetween(LocalDate.now(), LocalDate.now().plusDays(7))
                .stream()
                .map(InterventionResponse::from)
                .toList();
    }

    @GetMapping("/overdue-points")
    public List<MaintenancePointResponse> getOverdueMaintenancePoints() {
        return maintenancePointService.findAll()
                .stream()
                .filter(p -> p.getNextPlannedDate() != null && p.getNextPlannedDate().isBefore(LocalDate.now()))
                .map(MaintenancePointResponse::from)
                .toList();
    }
}
