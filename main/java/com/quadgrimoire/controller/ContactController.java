package com.quadgrimoire.controller;

import com.quadgrimoire.service.ContactService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:3000"})
public class ContactController {
    
    @Autowired
    private ContactService contactService;
    
    @PostMapping("/contact")
    public ResponseEntity<Map<String, Object>> contact(@RequestBody Map<String, String> contactData) {
        Map<String, Object> response = contactService.processContactForm(contactData);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/contact/stats")
    public ResponseEntity<Map<String, Object>> getContactStats() {
        Map<String, Object> stats = contactService.getContactStats();
        return ResponseEntity.ok(stats);
    }
}

