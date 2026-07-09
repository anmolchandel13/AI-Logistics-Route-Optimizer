package com.logistics.optimizer.service;

import com.logistics.optimizer.dto.response.DashboardStats;
import com.logistics.optimizer.dto.response.RouteOptimizationResponse;
import com.logistics.optimizer.dto.response.ShipmentResponse;
import com.logistics.optimizer.entity.Shipment;
import com.logistics.optimizer.entity.User;
import com.logistics.optimizer.enums.*;
import com.logistics.optimizer.repository.RouteOptimizationRepository;
import com.logistics.optimizer.repository.ShipmentRepository;
import com.logistics.optimizer.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final ShipmentRepository shipmentRepository;
    private final RouteOptimizationRepository routeOptimizationRepository;
    private final UserRepository userRepository;
    private final UserService userService;

    public DashboardStats getUserDashboard() {
        User user = userService.getCurrentUser();
        return buildStats(user);
    }

    public DashboardStats getAdminDashboard() {
        return buildAdminStats();
    }

    private DashboardStats buildStats(User user) {
        long total = shipmentRepository.countByUser(user);
        long pending = shipmentRepository.countByUserAndStatus(user, ShipmentStatus.PENDING);
        long optimized = shipmentRepository.countByUserAndStatus(user, ShipmentStatus.OPTIMIZED);
        long inTransit = shipmentRepository.countByUserAndStatus(user, ShipmentStatus.IN_TRANSIT);
        long delivered = shipmentRepository.countByUserAndStatus(user, ShipmentStatus.DELIVERED);
        long cancelled = shipmentRepository.countByUserAndStatus(user, ShipmentStatus.CANCELLED);

        Double avgScore = routeOptimizationRepository.findAverageOptimizationScore();
        Double totalDistance = routeOptimizationRepository.findTotalDistance();
        Double totalCost = routeOptimizationRepository.findTotalCost();
        Double totalCarbon = routeOptimizationRepository.findTotalCarbonEmissions();

        Map<String, Long> byStatus = new LinkedHashMap<>();
        byStatus.put("PENDING", pending);
        byStatus.put("OPTIMIZED", optimized);
        byStatus.put("IN_TRANSIT", inTransit);
        byStatus.put("DELIVERED", delivered);
        byStatus.put("CANCELLED", cancelled);

        Map<String, Long> byPriority = new LinkedHashMap<>();
        for (Priority p : Priority.values()) {
            long count = shipmentRepository.findByUserOrderByCreatedAtDesc(user).stream()
                    .filter(s -> s.getPriority() == p).count();
            byPriority.put(p.name(), count);
        }

        Map<String, Long> byVehicle = new LinkedHashMap<>();
        for (VehicleType v : VehicleType.values()) {
            long count = shipmentRepository.findByUserOrderByCreatedAtDesc(user).stream()
                    .filter(s -> s.getVehicleType() == v).count();
            if (count > 0) byVehicle.put(v.getDisplayName(), count);
        }

        List<ShipmentResponse> recent = shipmentRepository.findTop10ByUserOrderByCreatedAtDesc(user)
                .stream().map(this::mapShipment).toList();

        return DashboardStats.builder()
                .totalShipments(total)
                .pendingShipments(pending)
                .optimizedShipments(optimized)
                .inTransitShipments(inTransit)
                .deliveredShipments(delivered)
                .cancelledShipments(cancelled)
                .avgOptimizationScore(avgScore != null ? Math.round(avgScore * 10.0) / 10.0 : 0)
                .totalDistanceKm(totalDistance != null ? Math.round(totalDistance * 100.0) / 100.0 : 0)
                .totalCostEstimate(totalCost != null ? Math.round(totalCost * 100.0) / 100.0 : 0)
                .totalCarbonEmissionsKg(totalCarbon != null ? Math.round(totalCarbon * 100.0) / 100.0 : 0)
                .shipmentsByStatus(byStatus)
                .shipmentsByPriority(byPriority)
                .shipmentsByVehicle(byVehicle)
                .recentShipments(recent)
                .build();
    }

    private DashboardStats buildAdminStats() {
        long total = shipmentRepository.count();

        Map<String, Long> byStatus = new LinkedHashMap<>();
        for (ShipmentStatus s : ShipmentStatus.values()) {
            byStatus.put(s.name(), shipmentRepository.countByStatus(s));
        }

        Map<String, Long> byPriority = new LinkedHashMap<>();
        List<Shipment> all = shipmentRepository.findAll();
        for (Priority p : Priority.values()) {
            byPriority.put(p.name(), all.stream().filter(s -> s.getPriority() == p).count());
        }

        Map<String, Long> byVehicle = new LinkedHashMap<>();
        for (VehicleType v : VehicleType.values()) {
            long count = all.stream().filter(s -> s.getVehicleType() == v).count();
            if (count > 0) byVehicle.put(v.getDisplayName(), count);
        }

        Double avgScore = routeOptimizationRepository.findAverageOptimizationScore();
        Double totalDistance = routeOptimizationRepository.findTotalDistance();
        Double totalCost = routeOptimizationRepository.findTotalCost();
        Double totalCarbon = routeOptimizationRepository.findTotalCarbonEmissions();

        List<ShipmentResponse> recent = shipmentRepository.findTop10ByOrderByCreatedAtDesc()
                .stream().map(this::mapShipment).toList();

        return DashboardStats.builder()
                .totalShipments(total)
                .pendingShipments(byStatus.getOrDefault("PENDING", 0L))
                .optimizedShipments(byStatus.getOrDefault("OPTIMIZED", 0L))
                .inTransitShipments(byStatus.getOrDefault("IN_TRANSIT", 0L))
                .deliveredShipments(byStatus.getOrDefault("DELIVERED", 0L))
                .cancelledShipments(byStatus.getOrDefault("CANCELLED", 0L))
                .avgOptimizationScore(avgScore != null ? Math.round(avgScore * 10.0) / 10.0 : 0)
                .totalDistanceKm(totalDistance != null ? Math.round(totalDistance * 100.0) / 100.0 : 0)
                .totalCostEstimate(totalCost != null ? Math.round(totalCost * 100.0) / 100.0 : 0)
                .totalCarbonEmissionsKg(totalCarbon != null ? Math.round(totalCarbon * 100.0) / 100.0 : 0)
                .shipmentsByStatus(byStatus)
                .shipmentsByPriority(byPriority)
                .shipmentsByVehicle(byVehicle)
                .recentShipments(recent)
                .build();
    }

    private ShipmentResponse mapShipment(Shipment s) {
        ShipmentResponse.ShipmentResponseBuilder builder = ShipmentResponse.builder()
                .id(s.getId())
                .trackingNumber(s.getTrackingNumber())
                .pickupLocation(s.getPickupLocation())
                .destination(s.getDestination())
                .weightKg(s.getWeightKg())
                .vehicleType(s.getVehicleType())
                .cargoType(s.getCargoType())
                .priority(s.getPriority())
                .status(s.getStatus())
                .userName(s.getUser().getName())
                .userId(s.getUser().getId())
                .createdAt(s.getCreatedAt());

        if (s.getRouteOptimization() != null) {
            builder.routeOptimization(RouteOptimizationResponse.builder()
                    .optimizationScore(s.getRouteOptimization().getOptimizationScore())
                    .distanceKm(s.getRouteOptimization().getDistanceKm())
                    .costEstimate(s.getRouteOptimization().getCostEstimate())
                    .build());
        }

        return builder.build();
    }
}
