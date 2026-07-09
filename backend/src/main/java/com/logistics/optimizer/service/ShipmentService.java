package com.logistics.optimizer.service;

import com.logistics.optimizer.dto.request.ShipmentRequest;
import com.logistics.optimizer.dto.response.RouteOptimizationResponse;
import com.logistics.optimizer.dto.response.ShipmentResponse;
import com.logistics.optimizer.entity.RouteOptimization;
import com.logistics.optimizer.entity.Shipment;
import com.logistics.optimizer.entity.User;
import com.logistics.optimizer.enums.ShipmentStatus;
import com.logistics.optimizer.exception.BadRequestException;
import com.logistics.optimizer.exception.ResourceNotFoundException;
import com.logistics.optimizer.repository.ShipmentRepository;
import com.logistics.optimizer.util.TrackingNumberGenerator;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ShipmentService {

    private final ShipmentRepository shipmentRepository;
    private final UserService userService;
    private final GeminiAIService geminiAIService;
    private final NotificationService notificationService;

    @Transactional
    public ShipmentResponse createShipment(ShipmentRequest request) {
        User user = userService.getCurrentUser();

        Shipment shipment = Shipment.builder()
                .user(user)
                .trackingNumber(TrackingNumberGenerator.generate())
                .pickupLocation(request.getPickupLocation())
                .pickupLat(request.getPickupLat())
                .pickupLng(request.getPickupLng())
                .destination(request.getDestination())
                .destLat(request.getDestLat())
                .destLng(request.getDestLng())
                .weightKg(request.getWeightKg())
                .vehicleType(request.getVehicleType())
                .cargoType(request.getCargoType())
                .priority(request.getPriority())
                .deliveryDeadline(request.getDeliveryDeadline())
                .status(ShipmentStatus.PENDING)
                .notes(request.getNotes())
                .build();

        shipmentRepository.save(shipment);
        log.info("Shipment created: {} by user {}", shipment.getTrackingNumber(), user.getEmail());

        // Auto-optimize route using AI
        try {
            RouteOptimization optimization = geminiAIService.analyzeRoute(shipment);
            optimization.setShipment(shipment);
            shipment.setRouteOptimization(optimization);
            shipment.setStatus(ShipmentStatus.OPTIMIZED);
            shipmentRepository.save(shipment);

            notificationService.createNotification(user,
                    "Route Optimized",
                    "Route for shipment " + shipment.getTrackingNumber() + " has been optimized with a score of " + optimization.getOptimizationScore() + "/100",
                    com.logistics.optimizer.enums.NotificationType.SUCCESS);

            log.info("Route optimized for shipment: {}", shipment.getTrackingNumber());
        } catch (Exception e) {
            log.error("AI optimization failed for shipment {}: {}", shipment.getTrackingNumber(), e.getMessage());
            notificationService.createNotification(user,
                    "Optimization Failed",
                    "Route optimization failed for shipment " + shipment.getTrackingNumber() + ". Please try again.",
                    com.logistics.optimizer.enums.NotificationType.ERROR);
        }

        return mapToResponse(shipment);
    }

    public ShipmentResponse getShipment(Long id) {
        User user = userService.getCurrentUser();
        Shipment shipment = shipmentRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Shipment not found with id: " + id));
        return mapToResponse(shipment);
    }

    public ShipmentResponse getShipmentAdmin(Long id) {
        Shipment shipment = shipmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Shipment not found with id: " + id));
        return mapToResponse(shipment);
    }

    public List<ShipmentResponse> getUserShipments() {
        User user = userService.getCurrentUser();
        return shipmentRepository.findByUserOrderByCreatedAtDesc(user)
                .stream().map(this::mapToResponse).toList();
    }

    public List<ShipmentResponse> getAllShipments() {
        return shipmentRepository.findAllByOrderByCreatedAtDesc()
                .stream().map(this::mapToResponse).toList();
    }

    public List<ShipmentResponse> searchShipments(String query) {
        User user = userService.getCurrentUser();
        return shipmentRepository.searchByUser(user, query)
                .stream().map(this::mapToResponse).toList();
    }

    public List<ShipmentResponse> getShipmentsByStatus(String status) {
        User user = userService.getCurrentUser();
        ShipmentStatus shipmentStatus = ShipmentStatus.valueOf(status.toUpperCase());
        return shipmentRepository.findByUserAndStatusOrderByCreatedAtDesc(user, shipmentStatus)
                .stream().map(this::mapToResponse).toList();
    }

    @Transactional
    public ShipmentResponse updateStatus(Long id, String status) {
        User user = userService.getCurrentUser();
        Shipment shipment = shipmentRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Shipment not found"));

        try {
            ShipmentStatus newStatus = ShipmentStatus.valueOf(status.toUpperCase());
            shipment.setStatus(newStatus);
            shipmentRepository.save(shipment);

            notificationService.createNotification(user,
                    "Status Updated",
                    "Shipment " + shipment.getTrackingNumber() + " status changed to " + newStatus.getDisplayName(),
                    com.logistics.optimizer.enums.NotificationType.INFO);
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid status: " + status);
        }

        return mapToResponse(shipment);
    }

    @Transactional
    public void deleteShipment(Long id) {
        User user = userService.getCurrentUser();
        Shipment shipment = shipmentRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Shipment not found"));
        shipmentRepository.delete(shipment);
        log.info("Shipment deleted: {}", shipment.getTrackingNumber());
    }

    @Transactional
    public ShipmentResponse reOptimize(Long id) {
        User user = userService.getCurrentUser();
        Shipment shipment = shipmentRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Shipment not found"));

        RouteOptimization optimization = geminiAIService.analyzeRoute(shipment);
        optimization.setShipment(shipment);
        shipment.setRouteOptimization(optimization);
        shipment.setStatus(ShipmentStatus.OPTIMIZED);
        shipmentRepository.save(shipment);

        return mapToResponse(shipment);
    }

    private ShipmentResponse mapToResponse(Shipment shipment) {
        ShipmentResponse.ShipmentResponseBuilder builder = ShipmentResponse.builder()
                .id(shipment.getId())
                .trackingNumber(shipment.getTrackingNumber())
                .pickupLocation(shipment.getPickupLocation())
                .pickupLat(shipment.getPickupLat())
                .pickupLng(shipment.getPickupLng())
                .destination(shipment.getDestination())
                .destLat(shipment.getDestLat())
                .destLng(shipment.getDestLng())
                .weightKg(shipment.getWeightKg())
                .vehicleType(shipment.getVehicleType())
                .cargoType(shipment.getCargoType())
                .priority(shipment.getPriority())
                .deliveryDeadline(shipment.getDeliveryDeadline())
                .status(shipment.getStatus())
                .notes(shipment.getNotes())
                .userName(shipment.getUser().getName())
                .userId(shipment.getUser().getId())
                .createdAt(shipment.getCreatedAt())
                .updatedAt(shipment.getUpdatedAt());

        if (shipment.getRouteOptimization() != null) {
            RouteOptimization ro = shipment.getRouteOptimization();
            builder.routeOptimization(RouteOptimizationResponse.builder()
                    .id(ro.getId())
                    .recommendedRoute(ro.getRecommendedRoute())
                    .distanceKm(ro.getDistanceKm())
                    .estimatedTime(ro.getEstimatedTime())
                    .costEstimate(ro.getCostEstimate())
                    .fuelConsumptionLiters(ro.getFuelConsumptionLiters())
                    .carbonEmissionsKg(ro.getCarbonEmissionsKg())
                    .delayRisks(ro.getDelayRisks())
                    .weatherImpact(ro.getWeatherImpact())
                    .alternativeRoutes(ro.getAlternativeRoutes())
                    .optimizationSuggestions(ro.getOptimizationSuggestions())
                    .optimizationScore(ro.getOptimizationScore())
                    .aiModelUsed(ro.getAiModelUsed())
                    .generatedAt(ro.getGeneratedAt())
                    .build());
        }

        return builder.build();
    }
}
