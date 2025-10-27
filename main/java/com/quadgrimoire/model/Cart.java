package com.quadgrimoire.model;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "Carts")
public class Cart {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer cartID;
    
    @Column(nullable = false)
    private Integer cartBookID;
    
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
    
    @Column(nullable = false)
    private Integer quantity = 1;
    
    @Column(columnDefinition = "TEXT")
    private String enchantment;
    
    // Default constructor for JPA
    public Cart() {
    }
    
    // Getters and setters
    public Integer getCartID() {
        return cartID;
    }
    
    public void setCartID(Integer cartID) {
        this.cartID = cartID;
    }
    
    public Integer getCartBookID() {
        return cartBookID;
    }
    
    public void setCartBookID(Integer cartBookID) {
        this.cartBookID = cartBookID;
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

