package com.logistics.optimizer.controller;

import com.logistics.optimizer.dto.request.UpdateProfileRequest;
import com.logistics.optimizer.dto.response.ApiResponse;
import com.logistics.optimizer.dto.response.AuthResponse;
import com.logistics.optimizer.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Tag(name = "Users", description = "User profile management")
public class UserController {

    private final UserService userService;

    @GetMapping("/profile")
    @Operation(summary = "Get current user profile")
    public ResponseEntity<ApiResponse<AuthResponse>> getProfile() {
        return ResponseEntity.ok(ApiResponse.success(userService.getProfile()));
    }

    @PutMapping("/profile")
    @Operation(summary = "Update current user profile")
    public ResponseEntity<ApiResponse<AuthResponse>> updateProfile(
            @Valid @RequestBody UpdateProfileRequest request) {
        return ResponseEntity.ok(
                ApiResponse.success("Profile updated", userService.updateProfile(request)));
    }
}
