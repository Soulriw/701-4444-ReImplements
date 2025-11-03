package com.quadgrimoire.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class EmailService {

    @Autowired(required = false)
    private JavaMailSender mailSender;

    @Value("${spring.mail.username:}")
    private String fromEmail;

    @Value("${app.contact.email:khimmyy12@gmail.com}")
    private String contactEmail;

    /**
     * Send contact form email to admin
     * @param userEmail User's email address (from form, can be fake)
     * @param userName User's name (optional)
     * @param subject Email subject
     * @param message Email message
     * @return Map containing sending result
     */
    public Map<String, Object> sendContactEmail(String userEmail, String userName, String subject, String message) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            System.out.println("=== EMAIL SERVICE DEBUG ===");
            System.out.println("MailSender is null: " + (mailSender == null));
            System.out.println("FromEmail: " + fromEmail);
            System.out.println("ContactEmail: " + contactEmail);
            
            // Check if mail sender is available
            if (mailSender == null) {
                System.err.println("✗ ERROR: JavaMailSender is not configured. Email will not be sent.");
                response.put("success", false);
                response.put("error", "Email service is not configured");
                return response;
            }
            
            if (fromEmail == null || fromEmail.trim().isEmpty()) {
                System.err.println("✗ ERROR: From email is not configured. Email will not be sent.");
                response.put("success", false);
                response.put("error", "From email is not configured");
                return response;
            }
            
            System.out.println("✓ All checks passed, preparing email...");
            
            SimpleMailMessage emailMessage = new SimpleMailMessage();
            // Use authenticated email as From (Gmail may reject if From doesn't match authenticated account)
            emailMessage.setFrom(fromEmail);
            emailMessage.setTo(contactEmail);
            emailMessage.setSubject("Contact Form: " + subject);
            
            String emailBody = String.format(
                "You have received a new message from the contact form.\n\n" +
                "From: %s\n" +
                "Email: %s\n" +
                "Subject: %s\n\n" +
                "Message:\n%s",
                userName != null && !userName.trim().isEmpty() ? userName : "User",
                userEmail,
                subject,
                message
            );
            
            emailMessage.setText(emailBody);
            
            System.out.println("=== SENDING EMAIL ===");
            System.out.println("From (auth): " + fromEmail);
            System.out.println("To: " + contactEmail);
            System.out.println("Subject: " + emailMessage.getSubject());
            System.out.println("User Email: " + userEmail);
            System.out.println("User Name: " + userName);
            System.out.println("Email Body Preview: " + emailBody.substring(0, Math.min(100, emailBody.length())) + "...");
            System.out.println("=====================");
            
            mailSender.send(emailMessage);
            
            System.out.println("✓ Email sent successfully!");
            System.out.println("✓ Email should arrive at: " + contactEmail);
            System.out.println("✓ Please check Inbox and Spam folder");
            
            response.put("success", true);
            response.put("message", "Email sent successfully");
            return response;
            
        } catch (org.springframework.mail.MailAuthenticationException e) {
            System.err.println("=== EMAIL AUTHENTICATION ERROR ===");
            System.err.println("Error: " + e.getMessage());
            System.err.println("This usually means:");
            System.err.println("1. App Password is incorrect");
            System.err.println("2. 2-Step Verification is not enabled");
            System.err.println("3. Gmail account security settings block the connection");
            e.printStackTrace();
            response.put("success", false);
            response.put("error", "Email authentication failed. Please check your App Password and Gmail settings.");
            return response;
        } catch (Exception e) {
            System.err.println("=== EMAIL SEND ERROR ===");
            System.err.println("Error: " + e.getMessage());
            System.err.println("Error class: " + e.getClass().getName());
            e.printStackTrace();
            response.put("success", false);
            response.put("error", "Failed to send email: " + e.getMessage());
            return response;
        }
    }

    /**
     * Send auto-reply email to user
     * @param userEmail User's email address
     * @param userName User's name
     * @return Map containing sending result
     */
    public Map<String, Object> sendAutoReply(String userEmail, String userName) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Check if mail sender is available
            if (mailSender == null) {
                System.out.println("Warning: JavaMailSender is not configured. Auto-reply will not be sent.");
                response.put("success", false);
                response.put("error", "Email service is not configured");
                return response;
            }
            
            if (fromEmail == null || fromEmail.trim().isEmpty()) {
                System.out.println("Warning: From email is not configured. Auto-reply will not be sent.");
                response.put("success", false);
                response.put("error", "From email is not configured");
                return response;
            }
            
            SimpleMailMessage emailMessage = new SimpleMailMessage();
            emailMessage.setFrom(fromEmail);
            emailMessage.setTo(userEmail);
            emailMessage.setSubject("Thank you for contacting Quad Grimoire");
            
            String emailBody = String.format(
                "Dear %s,\n\n" +
                "Thank you for contacting Quad Grimoire. We have received your message and will get back to you soon.\n\n" +
                "Best regards,\n" +
                "Quad Grimoire Team",
                userName != null && !userName.trim().isEmpty() ? userName : "Customer"
            );
            
            emailMessage.setText(emailBody);
            
            System.out.println("=== SENDING AUTO-REPLY ===");
            System.out.println("From: " + fromEmail);
            System.out.println("To: " + userEmail);
            System.out.println("Subject: " + emailMessage.getSubject());
            System.out.println("==========================");
            
            mailSender.send(emailMessage);
            
            System.out.println("Auto-reply sent successfully!");
            
            response.put("success", true);
            response.put("message", "Auto-reply sent successfully");
            return response;
            
        } catch (Exception e) {
            System.err.println("Error sending auto-reply: " + e.getMessage());
            e.printStackTrace();
            response.put("success", false);
            response.put("error", "Failed to send auto-reply: " + e.getMessage());
            return response;
        }
    }
}

