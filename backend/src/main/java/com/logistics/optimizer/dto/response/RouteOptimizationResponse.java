package com.logistics.optimizer.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RouteOptimizationResponse {

    private Long id;
    private String recommendedRoute;
    private Double distanceKm;
    private String estimatedTime;
    private Double costEstimate;
    private Double fuelConsumptionLiters;
    private Double carbonEmissionsKg;
    private String delayRisks;
    private String weatherImpact;
    private String alternativeRoutes;
    private String optimizationSuggestions;
    private Integer optimizationScore;
    private String aiModelUsed;
    private LocalDateTime generatedAt;
}
