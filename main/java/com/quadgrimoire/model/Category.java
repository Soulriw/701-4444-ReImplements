package com.quadgrimoire.model;

import jakarta.persistence.*;

@Entity
@Table(name = "Categories")
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer categoryID;
    
    @Column(nullable = false, length = 100)
    private String categoryName;
    
    // Default constructor for JPA
    public Category() {
    }
    
    // Getters and setters
    public Integer getCategoryID() {
        return categoryID;
    }
    
    public void setCategoryID(Integer categoryID) {
        this.categoryID = categoryID;
    }
    
    public String getCategoryName() {
        return categoryName;
    }
    
    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }
}

