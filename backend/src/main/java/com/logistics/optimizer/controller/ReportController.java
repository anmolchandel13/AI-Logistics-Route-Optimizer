package com.logistics.optimizer.controller;

import com.logistics.optimizer.service.ReportService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
@Tag(name = "Reports", description = "Export shipment reports in various formats")
public class ReportController {

    private final ReportService reportService;

    @GetMapping("/pdf")
    @Operation(summary = "Download shipment report as PDF")
    public ResponseEntity<byte[]> downloadPdf() throws Exception {
        byte[] pdf = reportService.generatePdf();
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=shipment-report.pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }

    @GetMapping("/excel")
    @Operation(summary = "Download shipment report as Excel")
    public ResponseEntity<byte[]> downloadExcel() throws Exception {
        byte[] excel = reportService.generateExcel();
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=shipment-report.xlsx")
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(excel);
    }

    @GetMapping("/csv")
    @Operation(summary = "Download shipment report as CSV")
    public ResponseEntity<byte[]> downloadCsv() {
        byte[] csv = reportService.generateCsv();
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=shipment-report.csv")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(csv);
    }

    @GetMapping("/json")
    @Operation(summary = "Download shipment report as JSON")
    public ResponseEntity<byte[]> downloadJson() throws Exception {
        byte[] json = reportService.generateJson();
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=shipment-report.json")
                .contentType(MediaType.APPLICATION_JSON)
                .body(json);
    }
}
