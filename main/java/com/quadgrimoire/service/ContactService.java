package com.quadgrimoire.service;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;

@Service
public class ContactService {

    /**
     * Process contact form submission
     * @param contactData Map containing contact form data
     * @return Map containing processing result
     */
    public Map<String, Object> processContactForm(Map<String, String> contactData) {
        Map<String, Object> response = new HashMap<>();
        
        String name = contactData.get("name");
        String email = contactData.get("email");
        String subject = contactData.get("subject");
        String message = contactData.get("message");
        
        // Validate required fields (name is optional)
        if (email == null || email.trim().isEmpty()) {
            response.put("success", false);
            response.put("error", "Email is required");
            return response;
        }
        
        if (subject == null || subject.trim().isEmpty()) {
            response.put("success", false);
            response.put("error", "Subject is required");
            return response;
        }
        
        if (message == null || message.trim().isEmpty()) {
            response.put("success", false);
            response.put("error", "Message is required");
            return response;
        }
        
        // Validate email format (basic validation)
        if (!isValidEmail(email)) {
            response.put("success", false);
            response.put("error", "Invalid email format");
            return response;
        }
        
        try {
            // Log contact form submission with timestamp
            String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
            String userName = (name != null && !name.trim().isEmpty()) ? name.trim() : "User";
            
            System.out.println("=== CONTACT FORM SUBMISSION ===");
            System.out.println("Timestamp: " + timestamp);
            System.out.println("Name: " + userName);
            System.out.println("Email: " + email.trim());
            System.out.println("Subject: " + subject.trim());
            System.out.println("Message: " + message.trim());
            System.out.println("===============================");
            
            
            response.put("success", true);
            response.put("message", "Thank you for your message! We will get back to you soon.");
            response.put("timestamp", timestamp);
            return response;
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("error", "Failed to process contact form: " + e.getMessage());
            e.printStackTrace();
            return response;
        }
    }

    /**
     * Validate email format
     * @param email The email to validate
     * @return true if email format is valid
     */
    private boolean isValidEmail(String email) {
        if (email == null || email.trim().isEmpty()) {
            return false;
        }
        
        String emailRegex = "^[a-zA-Z0-9_+&*-]+(?:\\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,7}$";
        return email.matches(emailRegex);
    }

    /**
     * Get contact form statistics
     * @return Map containing contact form statistics
     */
    public Map<String, Object> getContactStats() {
        Map<String, Object> stats = new HashMap<>();
        
        try {
            // In a real application, this would query the database
            // For now, return basic stats
            stats.put("totalSubmissions", 0); // Would be actual count from database
            stats.put("lastSubmission", null); // Would be actual last submission time
            stats.put("message", "Contact form is working properly");
            return stats;
        } catch (Exception e) {
            stats.put("error", "Failed to get contact statistics: " + e.getMessage());
            return stats;
        }
    }

}
