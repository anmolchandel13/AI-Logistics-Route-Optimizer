package com.logistics.optimizer.service;

import com.logistics.optimizer.entity.Shipment;
import com.logistics.optimizer.entity.User;
import com.logistics.optimizer.repository.ShipmentRepository;
import com.lowagie.text.Document;
import com.lowagie.text.DocumentException;
import com.lowagie.text.Element;
import com.lowagie.text.Font;
import com.lowagie.text.PageSize;
import com.lowagie.text.Paragraph;
import com.lowagie.text.Phrase;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.FillPatternType;
import org.apache.poi.ss.usermodel.IndexedColors;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ReportService {

    private final ShipmentRepository shipmentRepository;
    private final UserService userService;
    private final ObjectMapper objectMapper;

    public byte[] generatePdf() throws DocumentException {
        User user = userService.getCurrentUser();
        List<Shipment> shipments = shipmentRepository.findByUserOrderByCreatedAtDesc(user);

        ByteArrayOutputStream out = new ByteArrayOutputStream();
        Document document = new Document(PageSize.A4.rotate());
        PdfWriter.getInstance(document, out);
        document.open();

        // Title
        Font titleFont = new Font(Font.HELVETICA, 20, Font.BOLD, new Color(26, 35, 126));
        Paragraph title = new Paragraph("AI Logistics Route Optimizer — Shipment Report", titleFont);
        title.setAlignment(Element.ALIGN_CENTER);
        title.setSpacingAfter(20);
        document.add(title);

        Font subtitleFont = new Font(Font.HELVETICA, 12, Font.NORMAL, Color.GRAY);
        Paragraph subtitle = new Paragraph("Generated for: " + user.getName() + " | Total Shipments: " + shipments.size(), subtitleFont);
        subtitle.setAlignment(Element.ALIGN_CENTER);
        subtitle.setSpacingAfter(20);
        document.add(subtitle);

        // Table
        PdfPTable table = new PdfPTable(7);
        table.setWidthPercentage(100);
        table.setWidths(new float[]{2, 3, 3, 1.5f, 1.5f, 1.5f, 2});

        String[] headers = {"Tracking #", "Pickup", "Destination", "Weight", "Vehicle", "Status", "Created"};
        Font headerFont = new Font(Font.HELVETICA, 10, Font.BOLD, Color.WHITE);

        for (String header : headers) {
            PdfPCell cell = new PdfPCell(new Phrase(header, headerFont));
            cell.setBackgroundColor(new Color(26, 35, 126));
            cell.setPadding(8);
            cell.setHorizontalAlignment(Element.ALIGN_CENTER);
            table.addCell(cell);
        }

        Font cellFont = new Font(Font.HELVETICA, 9, Font.NORMAL);
        for (Shipment s : shipments) {
            table.addCell(new Phrase(s.getTrackingNumber(), cellFont));
            table.addCell(new Phrase(s.getPickupLocation(), cellFont));
            table.addCell(new Phrase(s.getDestination(), cellFont));
            table.addCell(new Phrase(s.getWeightKg() + " kg", cellFont));
            table.addCell(new Phrase(s.getVehicleType().getDisplayName(), cellFont));
            table.addCell(new Phrase(s.getStatus().getDisplayName(), cellFont));
            table.addCell(new Phrase(s.getCreatedAt() != null ? s.getCreatedAt().toLocalDate().toString() : "", cellFont));
        }

        document.add(table);
        document.close();
        return out.toByteArray();
    }

    public byte[] generateExcel() throws IOException {
        User user = userService.getCurrentUser();
        List<Shipment> shipments = shipmentRepository.findByUserOrderByCreatedAtDesc(user);

        try (XSSFWorkbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Shipments");

            // Header style
            CellStyle headerStyle = workbook.createCellStyle();
            org.apache.poi.ss.usermodel.Font headerFontPoi = workbook.createFont();
            headerFontPoi.setBold(true);
            headerFontPoi.setFontHeightInPoints((short) 12);
            headerStyle.setFont(headerFontPoi);
            headerStyle.setFillForegroundColor(IndexedColors.DARK_BLUE.getIndex());
            headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            org.apache.poi.ss.usermodel.Font whiteFont = workbook.createFont();
            whiteFont.setColor(IndexedColors.WHITE.getIndex());
            whiteFont.setBold(true);
            headerStyle.setFont(whiteFont);

            Row headerRow = sheet.createRow(0);
            String[] columns = {"Tracking #", "Pickup Location", "Destination", "Weight (kg)",
                    "Vehicle Type", "Cargo Type", "Priority", "Status", "Cost ($)", "Distance (km)", "Created At"};

            for (int i = 0; i < columns.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(columns[i]);
                cell.setCellStyle(headerStyle);
            }

            int rowIdx = 1;
            for (Shipment s : shipments) {
                Row row = sheet.createRow(rowIdx++);
                row.createCell(0).setCellValue(s.getTrackingNumber());
                row.createCell(1).setCellValue(s.getPickupLocation());
                row.createCell(2).setCellValue(s.getDestination());
                row.createCell(3).setCellValue(s.getWeightKg());
                row.createCell(4).setCellValue(s.getVehicleType().getDisplayName());
                row.createCell(5).setCellValue(s.getCargoType().getDisplayName());
                row.createCell(6).setCellValue(s.getPriority().name());
                row.createCell(7).setCellValue(s.getStatus().getDisplayName());
                row.createCell(8).setCellValue(s.getRouteOptimization() != null ? s.getRouteOptimization().getCostEstimate() : 0);
                row.createCell(9).setCellValue(s.getRouteOptimization() != null ? s.getRouteOptimization().getDistanceKm() : 0);
                row.createCell(10).setCellValue(s.getCreatedAt() != null ? s.getCreatedAt().toString() : "");
            }

            for (int i = 0; i < columns.length; i++) {
                sheet.autoSizeColumn(i);
            }

            ByteArrayOutputStream out = new ByteArrayOutputStream();
            workbook.write(out);
            return out.toByteArray();
        }
    }

    public byte[] generateCsv() {
        User user = userService.getCurrentUser();
        List<Shipment> shipments = shipmentRepository.findByUserOrderByCreatedAtDesc(user);

        StringBuilder csv = new StringBuilder();
        csv.append("Tracking Number,Pickup Location,Destination,Weight (kg),Vehicle Type,Cargo Type,Priority,Status,Cost ($),Distance (km),Created At\n");

        for (Shipment s : shipments) {
            csv.append(String.format("%s,\"%s\",\"%s\",%.1f,%s,%s,%s,%s,%.2f,%.1f,%s\n",
                    s.getTrackingNumber(),
                    s.getPickupLocation().replace("\"", "\"\""),
                    s.getDestination().replace("\"", "\"\""),
                    s.getWeightKg(),
                    s.getVehicleType().getDisplayName(),
                    s.getCargoType().getDisplayName(),
                    s.getPriority().name(),
                    s.getStatus().getDisplayName(),
                    s.getRouteOptimization() != null ? s.getRouteOptimization().getCostEstimate() : 0,
                    s.getRouteOptimization() != null ? s.getRouteOptimization().getDistanceKm() : 0,
                    s.getCreatedAt() != null ? s.getCreatedAt().toLocalDate().toString() : ""
            ));
        }

        return csv.toString().getBytes();
    }

    public byte[] generateJson() throws IOException {
        User user = userService.getCurrentUser();
        List<Shipment> shipments = shipmentRepository.findByUserOrderByCreatedAtDesc(user);

        List<?> data = shipments.stream().map(s -> {
            var map = new java.util.LinkedHashMap<String, Object>();
            map.put("trackingNumber", s.getTrackingNumber());
            map.put("pickupLocation", s.getPickupLocation());
            map.put("destination", s.getDestination());
            map.put("weightKg", s.getWeightKg());
            map.put("vehicleType", s.getVehicleType().getDisplayName());
            map.put("cargoType", s.getCargoType().getDisplayName());
            map.put("priority", s.getPriority().name());
            map.put("status", s.getStatus().getDisplayName());
            if (s.getRouteOptimization() != null) {
                map.put("costEstimate", s.getRouteOptimization().getCostEstimate());
                map.put("distanceKm", s.getRouteOptimization().getDistanceKm());
                map.put("optimizationScore", s.getRouteOptimization().getOptimizationScore());
            }
            map.put("createdAt", s.getCreatedAt() != null ? s.getCreatedAt().toString() : null);
            return map;
        }).toList();

        return objectMapper.writerWithDefaultPrettyPrinter().writeValueAsBytes(data);
    }
}
