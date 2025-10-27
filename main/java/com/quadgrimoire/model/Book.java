package com.quadgrimoire.model;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "Books")
public class Book {
    @Id
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
    
    @Column(columnDefinition = "TEXT")
    private String enchantment;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "categoryID", insertable = false, updatable = false)
    private Category category;
    
    // Default constructor for JPA
    public Book() {
    }
    
    // Getters and setters
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
    
    public String getEnchantment() {
        return enchantment;
    }
    
    public void setEnchantment(String enchantment) {
        this.enchantment = enchantment;
    }
}

