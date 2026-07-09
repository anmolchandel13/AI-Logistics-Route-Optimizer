package com.logistics.optimizer.repository;

import com.logistics.optimizer.entity.RouteOptimization;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RouteOptimizationRepository extends JpaRepository<RouteOptimization, Long> {

    Optional<RouteOptimization> findByShipmentId(Long shipmentId);

    @Query("SELECT AVG(r.optimizationScore) FROM RouteOptimization r")
    Double findAverageOptimizationScore();

    @Query("SELECT COALESCE(SUM(r.distanceKm), 0) FROM RouteOptimization r")
    Double findTotalDistance();

    @Query("SELECT COALESCE(SUM(r.costEstimate), 0) FROM RouteOptimization r")
    Double findTotalCost();

    @Query("SELECT COALESCE(SUM(r.carbonEmissionsKg), 0) FROM RouteOptimization r")
    Double findTotalCarbonEmissions();
}
