package com.quadgrimoire.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;

import java.util.Properties;

@Configuration
public class MailConfig {

    @Value("${spring.mail.host:smtp.gmail.com}")
    private String host;

    @Value("${spring.mail.port:587}")
    private int port;

    @Value("${spring.mail.username}")
    private String username;

    @Value("${spring.mail.password:}")
    private String password;

    @Bean
    public JavaMailSender javaMailSender() {
        try {
            JavaMailSenderImpl mailSender = new JavaMailSenderImpl();
            mailSender.setHost(host);
            mailSender.setPort(port);
            
            System.out.println("=== CONFIGURING JAVA MAIL SENDER ===");
            System.out.println("Host: " + host);
            System.out.println("Port: " + port);
            System.out.println("Username: " + username);
            System.out.println("Password: " + (password != null && !password.isEmpty() ? "***" : "NOT SET"));
            
            if (username != null && !username.trim().isEmpty()) {
                mailSender.setUsername(username);
                mailSender.setPassword(password);
            }
            
            Properties props = mailSender.getJavaMailProperties();
            props.put("mail.transport.protocol", "smtp");
            props.put("mail.smtp.auth", "true");
            
            // For port 587 (TLS)
            if (port == 587) {
                props.put("mail.smtp.starttls.enable", "true");
                props.put("mail.smtp.starttls.required", "true");
            }
            
            // For port 465 (SSL)
            if (port == 465) {
                props.put("mail.smtp.ssl.enable", "true");
                props.put("mail.smtp.ssl.required", "true");
            }
            
            props.put("mail.smtp.connectiontimeout", "10000");
            props.put("mail.smtp.timeout", "10000");
            props.put("mail.smtp.writetimeout", "10000");
            props.put("mail.smtp.ssl.trust", "smtp.gmail.com");
            props.put("mail.debug", "false");
            
            System.out.println("JavaMailSender configured successfully!");
            System.out.println("=====================================");
            
            return mailSender;
        } catch (Exception e) {
            System.err.println("Failed to configure JavaMailSender: " + e.getMessage());
            e.printStackTrace();
            return null;
        }
    }
}

