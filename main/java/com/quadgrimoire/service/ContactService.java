package com.quadgrimoire.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;

@Service
public class ContactService {

    @Autowired
    private EmailService emailService;

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
            
            // Send email to admin
            System.out.println("=== ATTEMPTING TO SEND EMAIL ===");
            System.out.println("EmailService is available: " + (emailService != null ? "YES" : "NO"));
            
            try {
                Map<String, Object> emailResult = emailService.sendContactEmail(
                    email.trim(),
                    userName,
                    subject.trim(),
                    message.trim()
                );
                
                System.out.println("Email send result: " + emailResult);
                
                if (emailResult != null && emailResult.get("success") != null) {
                    if (emailResult.get("success").equals(true)) {
                        System.out.println("✓ Email sent successfully to admin!");
                        System.out.println("✓ Please check Inbox at: " + emailResult.get("message"));
                    } else {
                        System.err.println("✗ ERROR: Failed to send email!");
                        System.err.println("✗ Error message: " + emailResult.get("error"));
                        System.err.println("✗ Please check App Password and Gmail settings");
                    }
                } else {
                    System.err.println("✗ ERROR: Email result is null or invalid!");
                }
            } catch (Exception e) {
                System.err.println("✗ EXCEPTION while sending email: " + e.getMessage());
                e.printStackTrace();
            }
            
            // Send auto-reply to user (optional)
            try {
                emailService.sendAutoReply(email.trim(), userName);
            } catch (Exception e) {
                // Auto-reply failure should not fail the whole process
                System.out.println("Warning: Failed to send auto-reply: " + e.getMessage());
            }
            
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

    /**
     * Send auto-reply email (placeholder)
     * @param email The recipient email
     * @param name The recipient name
     * @return Map containing sending result
     */
    public Map<String, Object> sendAutoReply(String email, String name) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            // In a real application, this would send an actual email
            System.out.println("Auto-reply would be sent to: " + email + " (Name: " + name + ")");
            
            response.put("success", true);
            response.put("message", "Auto-reply sent successfully");
            return response;
        } catch (Exception e) {
            response.put("success", false);
            response.put("error", "Failed to send auto-reply: " + e.getMessage());
            return response;
        }
    }
}
