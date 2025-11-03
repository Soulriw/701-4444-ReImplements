package com.quadgrimoire.controller;

import com.quadgrimoire.model.Cart;
import com.quadgrimoire.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:3000"})
public class CartController {
    
    @Autowired
    private CartService cartService;
    
    @GetMapping("/cart")
    public ResponseEntity<List<Cart>> getCart() {
        List<Cart> carts = cartService.getAllCartItems();
        return ResponseEntity.ok(carts);
    }
    
    @GetMapping("/cart/count")
    public ResponseEntity<Map<String, Object>> getCartCount() {
        Long totalItems = cartService.getCartCount();
        Map<String, Object> response = Map.of("count", totalItems);
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/cart/add")
    public ResponseEntity<Map<String, Object>> addToCart(@RequestBody Map<String, Object> cartData) {
        Map<String, Object> response = cartService.addToCart(cartData);
        return response.get("success").equals(true) ? 
            ResponseEntity.ok(response) : 
            ResponseEntity.badRequest().body(response);
    }
    
    @DeleteMapping("/cart/remove/{id}")
    public ResponseEntity<Map<String, Object>> removeFromCart(@PathVariable Integer id) {
        Map<String, Object> response = cartService.removeFromCart(id);
        return response.get("success").equals(true) ? 
            ResponseEntity.ok(response) : 
            ResponseEntity.badRequest().body(response);
    }
    
    @PostMapping("/checkout")
    public ResponseEntity<Map<String, Object>> checkout(@RequestBody Map<String, List<Integer>> checkoutData) {
        List<Integer> cartIds = checkoutData.get("cartIds");
        Map<String, Object> response = cartService.checkout(cartIds);
        return response.get("success").equals(true) ? 
            ResponseEntity.ok(response) : 
            ResponseEntity.badRequest().body(response);
    }
    
    @GetMapping("/cart/summary")
    public ResponseEntity<Map<String, Object>> getCartSummary() {
        Map<String, Object> summary = cartService.getCartSummary();
        return ResponseEntity.ok(summary);
    }
}

