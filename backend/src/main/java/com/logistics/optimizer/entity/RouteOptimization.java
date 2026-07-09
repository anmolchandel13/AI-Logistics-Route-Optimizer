package com.logistics.optimizer.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "route_optimizations")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = "shipment")
@EqualsAndHashCode(exclude = "shipment")
public class RouteOptimization {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "shipment_id", nullable = false, unique = true)
    private Shipment shipment;

    @Column(columnDefinition = "TEXT")
    private String recommendedRoute;

    private Double distanceKm;

    @Column(length = 50)
    private String estimatedTime;

    private Double costEstimate;

    private Double fuelConsumptionLiters;

    private Double carbonEmissionsKg;

    @Column(columnDefinition = "TEXT")
    private String delayRisks;

    @Column(columnDefinition = "TEXT")
    private String weatherImpact;

    @Column(columnDefinition = "TEXT")
    private String alternativeRoutes;

    @Column(columnDefinition = "TEXT")
    private String optimizationSuggestions;

    @Column()
    private Integer optimizationScore;

    @Column(length = 50)
    private String aiModelUsed;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime generatedAt;
}
