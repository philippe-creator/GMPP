package com.gmpp.notification;

import com.gmpp.user.AppUser;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {
    private final NotificationService service;

    @GetMapping
    public List<Notification> myNotifications(@AuthenticationPrincipal AppUser user) {
        return service.findForUser(user.getId());
    }

    @GetMapping("/unread-count")
    public Map<String, Long> unreadCount(@AuthenticationPrincipal AppUser user) {
        return Map.of("count", service.countUnread(user.getId()));
    }

    @PatchMapping("/{id}/read")
    public void markRead(@PathVariable Long id) {
        service.markRead(id);
    }

    @PatchMapping("/read-all")
    public void markAllRead(@AuthenticationPrincipal AppUser user) {
        service.markAllRead(user.getId());
    }
}
