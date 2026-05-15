package com.gmpp.dashboard;

import java.util.List;
import java.util.Map;

public record DashboardStatsResponse(
        long totalMachines,
        long machinesInService,
        long totalMaintenancePoints,
        long totalInterventions,
        long planned,
        long overdue,
        long completed,
        double completionRate,
        double averageDuration,
        long alertsCount,
        long overduePoints,
        Map<String, Long> statusDistribution,
        List<Map<String, Object>> monthlyTrend,
        List<Map<String, Object>> machineRanking,
        List<Map<String, Object>> technicianPerformance,
        List<Map<String, Object>> recentActivity
) {}
