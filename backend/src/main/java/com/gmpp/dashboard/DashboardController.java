package com.gmpp.dashboard;

import com.gmpp.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.LinkedHashMap;
import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;
    private final UserRepository userRepository;

    @GetMapping("/stats")
    public DashboardStatsResponse stats() {
        return dashboardService.getStats();
    }

    @GetMapping("/technician")
    public TechnicianDashboardResponse technicianStats(@AuthenticationPrincipal UserDetails userDetails) {
        try {
            // Récupérer l'ID de l'utilisateur connecté via son email
            if (userDetails == null || userDetails.getUsername() == null) {
                return new TechnicianDashboardResponse(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, List.of(), new LinkedHashMap<>(), null, List.of(), List.of());
            }
            return userRepository.findByEmail(userDetails.getUsername())
                    .map(user -> dashboardService.getTechnicianStats(user.getId()))
                    .orElse(new TechnicianDashboardResponse(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, List.of(), new LinkedHashMap<>(), null, List.of(), List.of()));
        } catch (Exception e) {
            // En cas d'erreur, retourner une réponse avec des zéros
            e.printStackTrace();
            return new TechnicianDashboardResponse(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, List.of(), new LinkedHashMap<>(), null, List.of(), List.of());
        }
    }
}

