package com.logistics.optimizer.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardStats {

    private long totalShipments;
    private long pendingShipments;
    private long optimizedShipments;
    private long inTransitShipments;
    private long deliveredShipments;
    private long cancelledShipments;
    private double avgOptimizationScore;
    private double totalDistanceKm;
    private double totalCostEstimate;
    private double totalCarbonEmissionsKg;
    private Map<String, Long> shipmentsByStatus;
    private Map<String, Long> shipmentsByPriority;
    private Map<String, Long> shipmentsByVehicle;
    private List<ShipmentResponse> recentShipments;
}
