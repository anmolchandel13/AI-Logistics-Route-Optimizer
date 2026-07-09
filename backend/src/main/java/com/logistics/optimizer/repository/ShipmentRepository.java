package com.logistics.optimizer.repository;

import com.logistics.optimizer.entity.Shipment;
import com.logistics.optimizer.entity.User;
import com.logistics.optimizer.enums.ShipmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ShipmentRepository extends JpaRepository<Shipment, Long> {

    List<Shipment> findByUserOrderByCreatedAtDesc(User user);

    List<Shipment> findByUserAndStatusOrderByCreatedAtDesc(User user, ShipmentStatus status);

    Optional<Shipment> findByTrackingNumber(String trackingNumber);

    Optional<Shipment> findByIdAndUser(Long id, User user);

    long countByUser(User user);

    long countByUserAndStatus(User user, ShipmentStatus status);

    long countByStatus(ShipmentStatus status);

    List<Shipment> findTop10ByUserOrderByCreatedAtDesc(User user);

    List<Shipment> findTop10ByOrderByCreatedAtDesc();

    @Query("SELECT s FROM Shipment s WHERE s.user = :user AND " +
           "(LOWER(s.trackingNumber) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(s.pickupLocation) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(s.destination) LIKE LOWER(CONCAT('%', :query, '%')))")
    List<Shipment> searchByUser(@Param("user") User user, @Param("query") String query);

    List<Shipment> findAllByOrderByCreatedAtDesc();
}
