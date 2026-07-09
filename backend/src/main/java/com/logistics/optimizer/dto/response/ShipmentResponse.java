package com.logistics.optimizer.dto.response;

import com.logistics.optimizer.enums.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ShipmentResponse {

    private Long id;
    private String trackingNumber;
    private String pickupLocation;
    private Double pickupLat;
    private Double pickupLng;
    private String destination;
    private Double destLat;
    private Double destLng;
    private Double weightKg;
    private VehicleType vehicleType;
    private CargoType cargoType;
    private Priority priority;
    private LocalDateTime deliveryDeadline;
    private ShipmentStatus status;
    private String notes;
    private RouteOptimizationResponse routeOptimization;
    private String userName;
    private Long userId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
