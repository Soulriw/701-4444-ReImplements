package com.quadgrimoire.model;

import jakarta.persistence.*;

@Entity
@Table(name = "Users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer userID;
    
    @Column(unique = true, nullable = false, length = 100)
    private String userName;
    
    @Column(nullable = false, length = 255)
    private String userPassword;
    
    // Default constructor for JPA
    public User() {
    }
    
    // Getters and setters
    public Integer getUserID() {
        return userID;
    }
    
    public void setUserID(Integer userID) {
        this.userID = userID;
    }
    
    public String getUserName() {
        return userName;
    }
    
    public void setUserName(String userName) {
        this.userName = userName;
    }
    
    public String getUserPassword() {
        return userPassword;
    }
    
    public void setUserPassword(String userPassword) {
        this.userPassword = userPassword;
    }
}

