package com.quadgrimoire.service;

import com.quadgrimoire.model.User;
import com.quadgrimoire.model.Admin;
import com.quadgrimoire.repository.UserRepository;
import com.quadgrimoire.repository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private AdminRepository adminRepository;

    /**
     * Authenticate user login
     * @param username The username
     * @param password The password
     * @return Map containing authentication result and user data
     */
    public Map<String, Object> authenticateUser(String username, String password) {
        Map<String, Object> response = new HashMap<>();
        
        // Check if it's an admin
        Optional<Admin> adminOpt = adminRepository.findByAdminName(username);
        if (adminOpt.isPresent()) {
            Admin admin = adminOpt.get();
            if (admin.getAdminPassword().equals(password)) {
                Map<String, Object> userData = new HashMap<>();
                userData.put("id", admin.getAdminID());
                userData.put("username", admin.getAdminName());
                userData.put("isAdmin", true);
                
                response.put("success", true);
                response.put("user", userData);
                return response;
            }
        }
        
        // Check if it's a regular user
        Optional<User> userOpt = userRepository.findByUserName(username);
        if (userOpt.isEmpty()) {
            response.put("success", false);
            response.put("error", "Invalid username or password");
            return response;
        }
        
        User user = userOpt.get();
        if (!user.getUserPassword().equals(password)) {
            response.put("success", false);
            response.put("error", "Invalid username or password");
            return response;
        }
        
        Map<String, Object> userData = new HashMap<>();
        userData.put("id", user.getUserID());
        userData.put("username", user.getUserName());
        userData.put("isAdmin", false);
        
        response.put("success", true);
        response.put("user", userData);
        return response;
    }

    /**
     * Register a new user
     * @param userData Map containing user registration data
     * @return Map containing registration result
     */
    public Map<String, Object> registerUser(Map<String, String> userData) {
        Map<String, Object> response = new HashMap<>();
        
        String username = userData.get("username");
        String password = userData.get("password");
        
        if (username == null || password == null) {
            response.put("success", false);
            response.put("error", "All fields are required");
            return response;
        }
        
        // Check if username already exists
        if (userRepository.findByUserName(username).isPresent()) {
            response.put("success", false);
            response.put("error", "Username already exists");
            return response;
        }
        
        try {
            User newUser = new User();
            newUser.setUserName(username);
            newUser.setUserPassword(password);
            
            userRepository.save(newUser);
            
            response.put("success", true);
            response.put("message", "User registered successfully");
            return response;
        } catch (Exception e) {
            response.put("success", false);
            response.put("error", "Registration failed: " + e.getMessage());
            return response;
        }
    }

    /**
     * Validate user session
     * @param userId The user ID
     * @param isAdmin Whether the user is an admin
     * @return Map containing validation result
     */
    public Map<String, Object> validateSession(Integer userId, Boolean isAdmin) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            if (isAdmin) {
                Optional<Admin> adminOpt = adminRepository.findById(userId);
                if (adminOpt.isPresent()) {
                    response.put("success", true);
                    response.put("user", Map.of(
                        "id", adminOpt.get().getAdminID(),
                        "username", adminOpt.get().getAdminName(),
                        "isAdmin", true
                    ));
                } else {
                    response.put("success", false);
                    response.put("error", "Admin not found");
                }
            } else {
                Optional<User> userOpt = userRepository.findById(userId);
                if (userOpt.isPresent()) {
                    response.put("success", true);
                    response.put("user", Map.of(
                        "id", userOpt.get().getUserID(),
                        "username", userOpt.get().getUserName(),
                        "isAdmin", false
                    ));
                } else {
                    response.put("success", false);
                    response.put("error", "User not found");
                }
            }
        } catch (Exception e) {
            response.put("success", false);
            response.put("error", "Session validation failed: " + e.getMessage());
        }
        
        return response;
    }
}
