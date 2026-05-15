package com.gmpp.report;

import com.gmpp.common.CsvExportUtil;
import com.gmpp.common.PdfExportUtil;
import com.gmpp.intervention.Intervention;
import com.gmpp.intervention.InterventionRepository;
import com.gmpp.machine.Machine;
import com.gmpp.machine.MachineRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.format.DateTimeFormatter;
import java.util.List;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN','RESPONSABLE_MAINTENANCE')")
public class ReportController {

    private final InterventionRepository interventionRepository;
    private final MachineRepository machineRepository;

    private static final DateTimeFormatter FMT = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

    @GetMapping("/interventions/pdf")
    public ResponseEntity<byte[]> interventionsPdf() {
        List<Intervention> list = interventionRepository.findAll();
        List<String> headers = List.of("ID", "Machine", "Technicien", "Date planifiée", "Statut", "Durée (min)", "Constat");
        List<List<String>> rows = list.stream().map(i -> List.of(
                String.valueOf(i.getId()),
                i.getMachine().getName(),
                i.getTechnician() != null ? i.getTechnician().getFullName() : "-",
                i.getPlannedAt() != null ? i.getPlannedAt().format(FMT) : "-",
                i.getStatus().name(),
                i.getDurationMinutes() != null ? String.valueOf(i.getDurationMinutes()) : "-",
                i.getFindingStatus() != null ? i.getFindingStatus().name() : "-"
        )).toList();
        byte[] pdf = PdfExportUtil.createTablePdf("Rapport des Interventions", headers, rows);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=interventions.pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }

    @GetMapping("/interventions/csv")
    public ResponseEntity<byte[]> interventionsCsv() {
        List<Intervention> list = interventionRepository.findAll();
        List<String> headers = List.of("ID", "Machine", "Technicien", "Date planifiée", "Statut", "Durée (min)", "Observations");
        List<List<String>> rows = list.stream().map(i -> List.of(
                String.valueOf(i.getId()),
                i.getMachine().getName(),
                i.getTechnician() != null ? i.getTechnician().getFullName() : "",
                i.getPlannedAt() != null ? i.getPlannedAt().format(FMT) : "",
                i.getStatus().name(),
                i.getDurationMinutes() != null ? String.valueOf(i.getDurationMinutes()) : "",
                i.getObservations() != null ? i.getObservations() : ""
        )).toList();
        byte[] csv = CsvExportUtil.toCsv(headers, rows).getBytes();
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=interventions.csv")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(csv);
    }

    @GetMapping("/machines/pdf")
    public ResponseEntity<byte[]> machinesPdf() {
        List<Machine> list = machineRepository.findAll();
        List<String> headers = List.of("ID", "Nom", "Type", "Marque", "Modèle", "N° Série", "Localisation", "Statut", "Heures");
        List<List<String>> rows = list.stream().map(m -> List.of(
                String.valueOf(m.getId()), m.getName(),
                m.getMachineType() != null ? m.getMachineType() : "",
                m.getBrand() != null ? m.getBrand() : "",
                m.getModel() != null ? m.getModel() : "",
                m.getSerialNumber() != null ? m.getSerialNumber() : "",
                m.getLocation() != null ? m.getLocation() : "",
                m.getStatus().name(),
                String.valueOf(m.getOperatingHours())
        )).toList();
        byte[] pdf = PdfExportUtil.createTablePdf("Rapport du Parc Machines", headers, rows);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=machines.pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }

    @GetMapping("/machines/csv")
    public ResponseEntity<byte[]> machinesCsv() {
        List<Machine> list = machineRepository.findAll();
        List<String> headers = List.of("ID", "Nom", "Type", "Marque", "Localisation", "Statut", "Heures");
        List<List<String>> rows = list.stream().map(m -> List.of(
                String.valueOf(m.getId()), m.getName(),
                m.getMachineType() != null ? m.getMachineType() : "",
                m.getBrand() != null ? m.getBrand() : "",
                m.getLocation() != null ? m.getLocation() : "",
                m.getStatus().name(),
                String.valueOf(m.getOperatingHours())
        )).toList();
        byte[] csv = CsvExportUtil.toCsv(headers, rows).getBytes();
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=machines.csv")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(csv);
    }
}
