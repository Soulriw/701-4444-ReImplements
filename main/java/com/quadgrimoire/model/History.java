package com.quadgrimoire.model;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "Historys")
public class History {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer historyID;
    
    @Column(nullable = false)
    private Integer bookID;
    
    @Column(nullable = false, length = 255)
    private String bookName;
    
    @Column(nullable = false)
    private Integer categoryID;
    
    @Column(nullable = false, length = 100)
    private String categoryName;
    
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal sellPrice;
    
    @Column(nullable = false)
    private Integer quantity = 1;
    
    @Column(columnDefinition = "TEXT")
    private String enchantment;
    
    // Default constructor for JPA
    public History() {
    }
    
    // Getters and setters
    public Integer getHistoryID() {
        return historyID;
    }
    
    public void setHistoryID(Integer historyID) {
        this.historyID = historyID;
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
    
    public BigDecimal getSellPrice() {
        return sellPrice;
    }
    
    public void setSellPrice(BigDecimal sellPrice) {
        this.sellPrice = sellPrice;
    }
    
    public Integer getQuantity() {
        return quantity;
    }
    
    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }
    
    public String getEnchantment() {
        return enchantment;
    }
    
    public void setEnchantment(String enchantment) {
        this.enchantment = enchantment;
    }
}

