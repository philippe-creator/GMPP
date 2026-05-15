package com.gmpp.dashboard;

import java.util.List;
import java.util.Map;

public record TechnicianDashboardResponse(
        long totalInterventions,
        long thisMonth,
        long completed,
        long inProgress,
        long overdue,
        double completionRate,
        long planned,
        double averageDuration,
        long photosAttached,
        long reportsSubmitted,
        List<Map<String, Object>> weeklyActivity,
        Map<String, Long> statusDistribution,
        Map<String, Object> currentIntervention,
        List<Map<String, Object>> todaySchedule,
        List<Map<String, Object>> recentHistory
) {}
