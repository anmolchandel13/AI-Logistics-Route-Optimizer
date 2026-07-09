package com.logistics.optimizer.dto.request;

import com.logistics.optimizer.enums.CargoType;
import com.logistics.optimizer.enums.Priority;
import com.logistics.optimizer.enums.VehicleType;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ShipmentRequest {

    @NotBlank(message = "Pickup location is required")
    private String pickupLocation;

    private Double pickupLat;
    private Double pickupLng;

    @NotBlank(message = "Destination is required")
    private String destination;

    private Double destLat;
    private Double destLng;

    @NotNull(message = "Weight is required")
    @Positive(message = "Weight must be positive")
    @Max(value = 100000, message = "Weight cannot exceed 100,000 kg")
    private Double weightKg;

    @NotNull(message = "Vehicle type is required")
    private VehicleType vehicleType;

    @NotNull(message = "Cargo type is required")
    private CargoType cargoType;

    @NotNull(message = "Priority is required")
    private Priority priority;

    private LocalDateTime deliveryDeadline;

    private String notes;
}
