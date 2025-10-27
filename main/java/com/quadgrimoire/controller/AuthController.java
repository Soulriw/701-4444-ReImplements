package com.quadgrimoire.controller;

import com.quadgrimoire.model.User;
import com.quadgrimoire.model.Admin;
import com.quadgrimoire.repository.UserRepository;
import com.quadgrimoire.repository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:3000"})
public class AuthController {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private AdminRepository adminRepository;
    
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> credentials) {
        String username = credentials.get("username");
        String password = credentials.get("password");
        
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
                return ResponseEntity.ok(response);
            }
        }
        
        // Check if it's a regular user
        Optional<User> userOpt = userRepository.findByUserName(username);
        if (userOpt.isEmpty()) {
            response.put("success", false);
            response.put("error", "Invalid username or password");
            return ResponseEntity.ok(response);
        }
        
        User user = userOpt.get();
        if (!user.getUserPassword().equals(password)) {
            response.put("success", false);
            response.put("error", "Invalid username or password");
            return ResponseEntity.ok(response);
        }
        
        Map<String, Object> userData = new HashMap<>();
        userData.put("id", user.getUserID());
        userData.put("username", user.getUserName());
        userData.put("isAdmin", false);
        
        response.put("success", true);
        response.put("user", userData);
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(@RequestBody Map<String, String> userData) {
        String username = userData.get("username");
        String password = userData.get("password");
        
        Map<String, Object> response = new HashMap<>();
        
        // Check if user already exists
        Optional<User> existingUser = userRepository.findByUserName(username);
        if (existingUser.isPresent()) {
            response.put("success", false);
            response.put("error", "Username already exists");
            return ResponseEntity.ok(response);
        }
        
        // Create new user
        User newUser = new User();
        newUser.setUserName(username);
        newUser.setUserPassword(password);
        userRepository.save(newUser);
        
        Map<String, Object> userResponse = new HashMap<>();
        userResponse.put("id", newUser.getUserID());
        userResponse.put("username", newUser.getUserName());
        userResponse.put("isAdmin", false);
        
        response.put("success", true);
        response.put("user", userResponse);
        return ResponseEntity.ok(response);
    }
}

