package com.logistics.optimizer.controller;

import com.logistics.optimizer.dto.request.ShipmentRequest;
import com.logistics.optimizer.dto.response.ApiResponse;
import com.logistics.optimizer.dto.response.ShipmentResponse;
import com.logistics.optimizer.service.ShipmentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/shipments")
@RequiredArgsConstructor
@Tag(name = "Shipments", description = "Shipment CRUD and management APIs")
public class ShipmentController {

    private final ShipmentService shipmentService;

    @PostMapping
    @Operation(summary = "Create a new shipment (auto-optimized by AI)")
    public ResponseEntity<ApiResponse<ShipmentResponse>> createShipment(
            @Valid @RequestBody ShipmentRequest request) {
        ShipmentResponse response = shipmentService.createShipment(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Shipment created and route optimized", response));
    }

    @GetMapping
    @Operation(summary = "Get all shipments for the current user")
    public ResponseEntity<ApiResponse<List<ShipmentResponse>>> getMyShipments() {
        return ResponseEntity.ok(ApiResponse.success(shipmentService.getUserShipments()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get shipment details by ID")
    public ResponseEntity<ApiResponse<ShipmentResponse>> getShipment(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(shipmentService.getShipment(id)));
    }

    @GetMapping("/search")
    @Operation(summary = "Search shipments by tracking number, pickup, or destination")
    public ResponseEntity<ApiResponse<List<ShipmentResponse>>> searchShipments(
            @RequestParam String query) {
        return ResponseEntity.ok(ApiResponse.success(shipmentService.searchShipments(query)));
    }

    @GetMapping("/status/{status}")
    @Operation(summary = "Filter shipments by status")
    public ResponseEntity<ApiResponse<List<ShipmentResponse>>> getByStatus(
            @PathVariable String status) {
        return ResponseEntity.ok(ApiResponse.success(shipmentService.getShipmentsByStatus(status)));
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Update shipment status")
    public ResponseEntity<ApiResponse<ShipmentResponse>> updateStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        return ResponseEntity.ok(
                ApiResponse.success("Status updated", shipmentService.updateStatus(id, status)));
    }

    @PostMapping("/{id}/re-optimize")
    @Operation(summary = "Re-run AI route optimization for a shipment")
    public ResponseEntity<ApiResponse<ShipmentResponse>> reOptimize(@PathVariable Long id) {
        return ResponseEntity.ok(
                ApiResponse.success("Route re-optimized", shipmentService.reOptimize(id)));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a shipment")
    public ResponseEntity<ApiResponse<Void>> deleteShipment(@PathVariable Long id) {
        shipmentService.deleteShipment(id);
        return ResponseEntity.ok(ApiResponse.success("Shipment deleted", null));
    }
}
