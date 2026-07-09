package com.logistics.optimizer.controller;

import com.logistics.optimizer.dto.response.ApiResponse;
import com.logistics.optimizer.dto.response.DashboardStats;
import com.logistics.optimizer.dto.response.ShipmentResponse;
import com.logistics.optimizer.entity.User;
import com.logistics.optimizer.service.DashboardService;
import com.logistics.optimizer.service.ShipmentService;
import com.logistics.optimizer.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@Tag(name = "Admin", description = "Admin-only management APIs")
public class AdminController {

    private final UserService userService;
    private final ShipmentService shipmentService;
    private final DashboardService dashboardService;

    @GetMapping("/dashboard")
    @Operation(summary = "Get admin dashboard with system-wide statistics")
    public ResponseEntity<ApiResponse<DashboardStats>> getAdminDashboard() {
        return ResponseEntity.ok(ApiResponse.success(dashboardService.getAdminDashboard()));
    }

    @GetMapping("/users")
    @Operation(summary = "Get all users")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getAllUsers() {
        List<Map<String, Object>> users = userService.findAllUsers().stream().map(u -> {
            Map<String, Object> map = new java.util.LinkedHashMap<>();
            map.put("id", u.getId());
            map.put("name", u.getName());
            map.put("email", u.getEmail());
            map.put("role", u.getRole().name());
            map.put("phone", u.getPhone());
            map.put("company", u.getCompany());
            map.put("active", u.getActive());
            map.put("createdAt", u.getCreatedAt());
            return map;
        }).toList();
        return ResponseEntity.ok(ApiResponse.success(users));
    }

    @PatchMapping("/users/{id}/toggle-status")
    @Operation(summary = "Activate or deactivate a user")
    public ResponseEntity<ApiResponse<Void>> toggleUserStatus(@PathVariable Long id) {
        userService.toggleUserStatus(id);
        return ResponseEntity.ok(ApiResponse.success("User status toggled", null));
    }

    @GetMapping("/shipments")
    @Operation(summary = "Get all shipments (admin view)")
    public ResponseEntity<ApiResponse<List<ShipmentResponse>>> getAllShipments() {
        return ResponseEntity.ok(ApiResponse.success(shipmentService.getAllShipments()));
    }

    @GetMapping("/shipments/{id}")
    @Operation(summary = "Get any shipment by ID (admin)")
    public ResponseEntity<ApiResponse<ShipmentResponse>> getShipment(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(shipmentService.getShipmentAdmin(id)));
    }
}
