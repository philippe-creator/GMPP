package com.gmpp.audit;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AuditService {
    private final AuditLogRepository repo;

    public void log(String userEmail, String action, String entityType, Long entityId, String details) {
        repo.save(AuditLog.builder()
                .userEmail(userEmail).action(action)
                .entityType(entityType).entityId(entityId)
                .details(details).build());
    }

    public List<AuditLog> findRecent() { return repo.findTop50ByOrderByPerformedAtDesc(); }
    public List<AuditLog> findByEntity(String type, Long id) { return repo.findByEntityTypeAndEntityId(type, id); }
    public List<AuditLog> findByUser(String email) { return repo.findByUserEmail(email); }
}
