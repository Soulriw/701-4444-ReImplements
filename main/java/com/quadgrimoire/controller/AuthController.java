package com.quadgrimoire.controller;

import com.quadgrimoire.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:3000"})
public class AuthController {
    
    @Autowired
    private AuthService authService;
    
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> credentials) {
        String username = credentials.get("username");
        String password = credentials.get("password");
        
        Map<String, Object> response = authService.authenticateUser(username, password);
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(@RequestBody Map<String, String> userData) {
        Map<String, Object> response = authService.registerUser(userData);
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/validate-session")
    public ResponseEntity<Map<String, Object>> validateSession(@RequestBody Map<String, Object> sessionData) {
        Integer userId = (Integer) sessionData.get("userId");
        Boolean isAdmin = (Boolean) sessionData.get("isAdmin");
        
        Map<String, Object> response = authService.validateSession(userId, isAdmin);
        return ResponseEntity.ok(response);
    }
}

