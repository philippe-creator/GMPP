package com.gmpp.notification;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {
    private final NotificationRepository repo;

    public void send(Long userId, String title, String message, NotificationType type, Long entityId, String entityType) {
        repo.save(Notification.builder()
                .userId(userId).title(title).message(message)
                .type(type).entityId(entityId).entityType(entityType).read(false).build());
    }

    public List<Notification> findForUser(Long userId) {
        return repo.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public List<Notification> findUnread(Long userId) {
        return repo.findByUserIdAndReadFalse(userId);
    }

    public long countUnread(Long userId) {
        return repo.countByUserIdAndReadFalse(userId);
    }

    @Transactional
    public void markRead(Long id) {
        repo.findById(id).ifPresent(n -> { n.setRead(true); repo.save(n); });
    }

    @Transactional
    public void markAllRead(Long userId) {
        repo.findByUserIdAndReadFalse(userId).forEach(n -> { n.setRead(true); repo.save(n); });
    }
}
