package com.quadgrimoire.model;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "PromotionsBook")
public class PromotionBook {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer proBookID;
    
    @Column(nullable = false)
    private Integer bookID;
    
    @Column(nullable = false, length = 255)
    private String bookName;
    
    @Column(nullable = false)
    private Integer categoryID;
    
    @Column(nullable = false, length = 100)
    private String categoryName;
    
    @Column(columnDefinition = "TEXT")
    private String bookDescription;
    
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;
    
    @Column(precision = 10, scale = 2)
    private BigDecimal proPrice;
    
    // Default constructor for JPA
    public PromotionBook() {
    }
    
    // Getters and setters
    public Integer getProBookID() {
        return proBookID;
    }
    
    public void setProBookID(Integer proBookID) {
        this.proBookID = proBookID;
    }
    
    public Integer getBookID() {
        return bookID;
    }
    
    public void setBookID(Integer bookID) {
        this.bookID = bookID;
    }
    
    public String getBookName() {
        return bookName;
    }
    
    public void setBookName(String bookName) {
        this.bookName = bookName;
    }
    
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
    
    public String getBookDescription() {
        return bookDescription;
    }
    
    public void setBookDescription(String bookDescription) {
        this.bookDescription = bookDescription;
    }
    
    public BigDecimal getPrice() {
        return price;
    }
    
    public void setPrice(BigDecimal price) {
        this.price = price;
    }
    
    public BigDecimal getProPrice() {
        return proPrice;
    }
    
    public void setProPrice(BigDecimal proPrice) {
        this.proPrice = proPrice;
    }
}

