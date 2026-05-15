package com.gmpp.audit;

import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/audit")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN','RESPONSABLE_MAINTENANCE')")
public class AuditController {
    private final AuditService auditService;

    @GetMapping
    public List<AuditLog> recent() { return auditService.findRecent(); }

    @GetMapping("/{type}/{id}")
    public List<AuditLog> byEntity(@PathVariable String type, @PathVariable Long id) {
        return auditService.findByEntity(type, id);
    }
}
