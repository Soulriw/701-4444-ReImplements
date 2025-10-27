package com.quadgrimoire.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:3000"})
public class ContactController {
    
    @PostMapping("/contact")
    public ResponseEntity<Map<String, Object>> contact(@RequestBody Map<String, String> contactData) {
        Map<String, Object> response = new HashMap<>();
        
        String name = contactData.get("name");
        String email = contactData.get("email");
        String subject = contactData.get("subject");
        String message = contactData.get("message");
        
        if (name == null || email == null || subject == null || message == null) {
            response.put("success", false);
            response.put("error", "All fields are required");
            return ResponseEntity.ok(response);
        }
        
        // Log contact form submission
        System.out.println("Contact form submission: " + contactData);
        
        response.put("success", true);
        response.put("message", "Message sent successfully");
        return ResponseEntity.ok(response);
    }
}

