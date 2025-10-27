package com.quadgrimoire.model;

import jakarta.persistence.*;

@Entity
@Table(name = "Admins")
public class Admin {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer adminID;
    
    @Column(unique = true, nullable = false, length = 100)
    private String adminName;
    
    @Column(nullable = false, length = 255)
    private String adminPassword;
    
    // Default constructor for JPA
    public Admin() {
    }
    
    // Getters and setters
    public Integer getAdminID() {
        return adminID;
    }
    
    public void setAdminID(Integer adminID) {
        this.adminID = adminID;
    }
    
    public String getAdminName() {
        return adminName;
    }
    
    public void setAdminName(String adminName) {
        this.adminName = adminName;
    }
    
    public String getAdminPassword() {
        return adminPassword;
    }
    
    public void setAdminPassword(String adminPassword) {
        this.adminPassword = adminPassword;
    }
}

