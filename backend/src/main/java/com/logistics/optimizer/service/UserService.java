package com.logistics.optimizer.service;

import com.logistics.optimizer.dto.request.UpdateProfileRequest;
import com.logistics.optimizer.dto.response.AuthResponse;
import com.logistics.optimizer.entity.User;
import com.logistics.optimizer.exception.ResourceNotFoundException;
import com.logistics.optimizer.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    public AuthResponse getProfile() {
        User user = getCurrentUser();
        return AuthResponse.builder()
                .userId(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .build();
    }

    public AuthResponse updateProfile(UpdateProfileRequest request) {
        User user = getCurrentUser();

        if (request.getName() != null) user.setName(request.getName());
        if (request.getPhone() != null) user.setPhone(request.getPhone());
        if (request.getCompany() != null) user.setCompany(request.getCompany());

        userRepository.save(user);

        return AuthResponse.builder()
                .userId(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .build();
    }

    public User findById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
    }

    public List<User> findAllUsers() {
        return userRepository.findAll();
    }

    public void toggleUserStatus(Long id) {
        User user = findById(id);
        user.setActive(!user.getActive());
        userRepository.save(user);
    }
}
