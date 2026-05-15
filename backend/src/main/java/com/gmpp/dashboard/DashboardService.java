package com.gmpp.dashboard;

import com.gmpp.intervention.*;
import com.gmpp.machine.*;
import com.gmpp.maintenance.MaintenancePointRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final MachineRepository machineRepository;
    private final MaintenancePointRepository maintenancePointRepository;
    private final InterventionRepository interventionRepository;

    /** Retourne 0 si la requête échoue (DB vide, table inexistante, etc.) */
    private long safe(java.util.concurrent.Callable<Long> fn) {
        try { return fn.call(); } catch (Exception e) { return 0L; }
    }

    public DashboardStatsResponse getStats() {

        long totalMachines     = safe(machineRepository::count);
        long machinesInService = safe(() -> machineRepository.countByStatus(MachineStatus.EN_SERVICE));
        long totalMaintenancePoints = safe(maintenancePointRepository::count);
        long totalInterventions     = safe(interventionRepository::count);

        long planned    = safe(() -> interventionRepository.countByStatus(InterventionStatus.PLANIFIEE));
        long overdue    = safe(() -> interventionRepository.countByStatus(InterventionStatus.EN_RETARD));
        long completed  = safe(() -> interventionRepository.countByStatus(InterventionStatus.TERMINEE));
        long inProgress = safe(() -> interventionRepository.countByStatus(InterventionStatus.EN_COURS));
        long cancelled  = safe(() -> interventionRepository.countByStatus(InterventionStatus.ANNULEE));

        double completionRate = totalInterventions == 0 ? 0 : (completed * 100.0) / totalInterventions;

        double averageDuration = 0;
        try {
            averageDuration = interventionRepository.findAll().stream()
                    .filter(i -> i.getDurationMinutes() != null)
                    .mapToInt(Intervention::getDurationMinutes)
                    .average().orElse(0);
        } catch (Exception ignored) {}

        long alertsCount = 0;
        try {
            alertsCount = interventionRepository
                    .findByPlannedAtBetween(LocalDateTime.now(), LocalDateTime.now().plusDays(7))
                    .stream().filter(i -> i.getStatus() == InterventionStatus.PLANIFIEE).count();
        } catch (Exception ignored) {}

        long overduePoints = 0;
        try {
            overduePoints = maintenancePointRepository
                    .findByNextPlannedDateLessThanEqual(LocalDate.now()).size();
        } catch (Exception ignored) {}

        // LinkedHashMap au lieu de Map.of() — sérialisable et ordonné
        Map<String, Long> statusDistribution = new LinkedHashMap<>();
        statusDistribution.put("PLANIFIEE", planned);
        statusDistribution.put("EN_COURS",  inProgress);
        statusDistribution.put("TERMINEE",  completed);
        statusDistribution.put("EN_RETARD", overdue);
        statusDistribution.put("ANNULEE",   cancelled);

        return new DashboardStatsResponse(
                totalMachines, machinesInService, totalMaintenancePoints, totalInterventions,
                planned, overdue, completed, completionRate, averageDuration,
                alertsCount, overduePoints, statusDistribution,
                buildMonthlyTrend(), buildMachineRanking(), buildTechnicianPerformance(), buildRecentActivity()
        );
    }

    private List<Map<String, Object>> buildMonthlyTrend() {
        List<Map<String, Object>> trend = new ArrayList<>();
        for (int i = 5; i >= 0; i--) {
            LocalDate start = LocalDate.now().minusMonths(i).withDayOfMonth(1);
            LocalDate end   = start.plusMonths(1).minusDays(1);
            try {
                List<Intervention> list = interventionRepository.findByPlannedAtBetween(
                        start.atStartOfDay(), end.atTime(23, 59, 59));
                long done = list.stream().filter(x -> x.getStatus() == InterventionStatus.TERMINEE).count();
                long late = list.stream().filter(x -> x.getStatus() == InterventionStatus.EN_RETARD).count();
                Map<String, Object> m = new LinkedHashMap<>();
                m.put("month", start.getMonth().name().substring(0, 3));
                m.put("total", list.size());
                m.put("completed", done);
                m.put("overdue", late);
                trend.add(m);
            } catch (Exception e) {
                Map<String, Object> m = new LinkedHashMap<>();
                m.put("month", start.getMonth().name().substring(0, 3));
                m.put("total", 0); m.put("completed", 0); m.put("overdue", 0);
                trend.add(m);
            }
        }
        return trend;
    }

    private List<Map<String, Object>> buildMachineRanking() {
        try {
            return interventionRepository.findAll().stream()
                    .filter(i -> i.getMachine() != null)
                    .collect(Collectors.groupingBy(i -> i.getMachine().getName(), Collectors.counting()))
                    .entrySet().stream()
                    .sorted((a, b) -> Long.compare(b.getValue(), a.getValue()))
                    .map(e -> {
                        Map<String, Object> m = new LinkedHashMap<>();
                        m.put("machine", e.getKey());
                        m.put("count", e.getValue().longValue());
                        return m;
                    }).toList();
        } catch (Exception e) { return List.of(); }
    }

    private List<Map<String, Object>> buildRecentActivity() {
        try {
            return interventionRepository.findAll().stream()
                    .sorted(Comparator.comparing(Intervention::getPlannedAt,
                            Comparator.nullsLast(Comparator.reverseOrder())))
                    .limit(5)
                    .map(i -> {
                        Map<String, Object> m = new LinkedHashMap<>();
                        m.put("id", i.getId());
                        m.put("machine", i.getMachine() != null ? i.getMachine().getName() : "N/A");
                        m.put("status", i.getStatus().name());
                        m.put("technician", i.getTechnician() != null ? i.getTechnician().getFullName() : "Non assigné");
                        m.put("date", i.getPlannedAt());
                        return m;
                    }).toList();
        } catch (Exception e) { return List.of(); }
    }

    private List<Map<String, Object>> buildTechnicianPerformance() {
        try {
            return interventionRepository.findAll().stream()
                    .filter(i -> i.getTechnician() != null)
                    .collect(Collectors.groupingBy(i -> i.getTechnician().getFullName()))
                    .entrySet().stream()
                    .map(e -> {
                        List<Intervention> list = e.getValue();
                        long total    = list.size();
                        long done     = list.stream().filter(x -> x.getStatus() == InterventionStatus.TERMINEE).count();
                        long late     = list.stream().filter(x -> x.getStatus() == InterventionStatus.EN_RETARD).count();
                        Map<String, Object> m = new LinkedHashMap<>();
                        m.put("technician", e.getKey());
                        m.put("total", total);
                        m.put("completed", done);
                        m.put("overdue", late);
                        return m;
                    })
                    .sorted((a, b) -> Long.compare((Long) b.get("total"), (Long) a.get("total")))
                    .toList();
        } catch (Exception e) { return List.of(); }
    }

    public TechnicianDashboardResponse getTechnicianStats(Long technicianId) {
        try {
            List<Intervention> techInterventions;
            try {
                techInterventions = interventionRepository.findByTechnicianId(technicianId);
            } catch (Exception e) {
                techInterventions = new ArrayList<>();
            }
            
            long totalInterventions = techInterventions.size();
            long thisMonth = techInterventions.stream()
                    .filter(i -> i.getPlannedAt() != null && 
                               i.getPlannedAt().getMonth() == LocalDate.now().getMonth() &&
                               i.getPlannedAt().getYear() == LocalDate.now().getYear())
                    .count();
            long completed = techInterventions.stream()
                    .filter(i -> i.getStatus() == InterventionStatus.TERMINEE)
                    .count();
            long inProgress = techInterventions.stream()
                    .filter(i -> i.getStatus() == InterventionStatus.EN_COURS)
                    .count();
            long overdue = techInterventions.stream()
                    .filter(i -> i.getStatus() == InterventionStatus.EN_RETARD)
                    .count();
            
            double completionRate = totalInterventions > 0 ? (completed * 100.0) / totalInterventions : 0;
            
            long planned = techInterventions.stream()
                    .filter(i -> i.getStatus() == InterventionStatus.PLANIFIEE)
                    .count();
            
            double averageDuration = techInterventions.stream()
                    .filter(i -> i.getDurationMinutes() != null)
                    .mapToInt(Intervention::getDurationMinutes)
                    .average()
                    .orElse(0);
            
            return new TechnicianDashboardResponse(
                    totalInterventions, thisMonth, completed, inProgress, overdue, completionRate,
                    planned, averageDuration, 5, 8, // photosAttached et reportsSubmitted simulés
                    buildWeeklyActivity(), buildTechnicianStatusDistribution(technicianId),
                    buildCurrentIntervention(technicianId), buildTodaySchedule(technicianId),
                    buildRecentHistory(technicianId)
            );
        } catch (Exception e) {
            // En cas d'erreur, retourner une réponse avec des zéros
            return new TechnicianDashboardResponse(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, List.of(), new LinkedHashMap<>(), null, List.of(), List.of());
        }
    }

    private List<Map<String, Object>> buildWeeklyActivity() {
        List<Map<String, Object>> activity = new ArrayList<>();
        for (int i = 6; i >= 0; i--) {
            LocalDate date = LocalDate.now().minusDays(i);
            Map<String, Object> day = new LinkedHashMap<>();
            day.put("day", date.getDayOfWeek().name().substring(0, 3));
            day.put("interventions", (long) (Math.random() * 20 + 5)); // Simulé
            day.put("completed", (long) (Math.random() * 15 + 3)); // Simulé
            activity.add(day);
        }
        return activity;
    }

    private Map<String, Long> buildTechnicianStatusDistribution(Long technicianId) {
        Map<String, Long> distribution = new LinkedHashMap<>();
        try {
            List<Intervention> interventions = interventionRepository.findByTechnicianId(technicianId);
            distribution.put("PLANIFIEE", interventions.stream()
                    .filter(i -> i.getStatus() == InterventionStatus.PLANIFIEE).count());
            distribution.put("EN_COURS", interventions.stream()
                    .filter(i -> i.getStatus() == InterventionStatus.EN_COURS).count());
            distribution.put("TERMINEE", interventions.stream()
                    .filter(i -> i.getStatus() == InterventionStatus.TERMINEE).count());
            distribution.put("EN_RETARD", interventions.stream()
                    .filter(i -> i.getStatus() == InterventionStatus.EN_RETARD).count());
        } catch (Exception e) {
            distribution.put("PLANIFIEE", 0L);
            distribution.put("EN_COURS", 0L);
            distribution.put("TERMINEE", 0L);
            distribution.put("EN_RETARD", 0L);
        }
        return distribution;
    }

    private Map<String, Object> buildCurrentIntervention(Long technicianId) {
        try {
            return interventionRepository.findByTechnicianId(technicianId).stream()
                    .filter(i -> i.getStatus() == InterventionStatus.EN_COURS)
                    .findFirst()
                    .map(i -> {
                        Map<String, Object> intervention = new LinkedHashMap<>();
                        intervention.put("id", i.getId());
                        intervention.put("machine", i.getMachine() != null ? i.getMachine().getName() : "N/A");
                        intervention.put("maintenancePoint", i.getMaintenancePoint() != null ? i.getMaintenancePoint().getDescription() : "N/A");
                        intervention.put("startedAt", i.getExecutedAt());
                        intervention.put("duration", i.getDurationMinutes());
                        return intervention;
                    })
                    .orElse(null);
        } catch (Exception e) {
            return null;
        }
    }

    private List<Map<String, Object>> buildTodaySchedule(Long technicianId) {
        try {
            LocalDateTime todayStart = LocalDate.now().atStartOfDay();
            LocalDateTime todayEnd = todayStart.plusDays(1);
            return interventionRepository.findByTechnicianId(technicianId).stream()
                    .filter(i -> i.getPlannedAt() != null && 
                               !i.getPlannedAt().isBefore(todayStart) && 
                               i.getPlannedAt().isBefore(todayEnd))
                    .map(i -> {
                        Map<String, Object> schedule = new LinkedHashMap<>();
                        schedule.put("id", i.getId());
                        schedule.put("machine", i.getMachine() != null ? i.getMachine().getName() : "N/A");
                        schedule.put("time", i.getPlannedAt());
                        schedule.put("duration", i.getDurationMinutes());
                        schedule.put("status", i.getStatus().name());
                        return schedule;
                    })
                    .toList();
        } catch (Exception e) {
            return List.of();
        }
    }

    private List<Map<String, Object>> buildRecentHistory(Long technicianId) {
        try {
            return interventionRepository.findByTechnicianId(technicianId).stream()
                    .sorted(Comparator.comparing(Intervention::getPlannedAt, Comparator.nullsLast(Comparator.reverseOrder())))
                    .limit(5)
                    .map(i -> {
                        Map<String, Object> history = new LinkedHashMap<>();
                        history.put("id", i.getId());
                        history.put("machine", i.getMachine() != null ? i.getMachine().getName() : "N/A");
                        history.put("status", i.getStatus().name());
                        history.put("date", i.getPlannedAt());
                        history.put("duration", i.getDurationMinutes());
                        return history;
                    })
                    .toList();
        } catch (Exception e) {
            return List.of();
        }
    }
}
