package com.quadgrimoire.controller;

import com.quadgrimoire.model.Cart;
import com.quadgrimoire.model.Book;
import com.quadgrimoire.repository.CartRepository;
import com.quadgrimoire.repository.BookRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:3000"})
public class CartController {
    
    @Autowired
    private CartRepository cartRepository;
    
    @Autowired
    private BookRepository bookRepository;
    
    @GetMapping("/cart")
    public ResponseEntity<List<Cart>> getCart() {
        List<Cart> carts = cartRepository.findAll();
        return ResponseEntity.ok(carts);
    }
    
    @GetMapping("/cart/count")
    public ResponseEntity<Map<String, Object>> getCartCount() {
        Long totalItems = cartRepository.getTotalCartCount();
        Map<String, Object> response = new HashMap<>();
        response.put("count", totalItems != null ? totalItems : 0);
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/cart/add")
    public ResponseEntity<Map<String, Object>> addToCart(@RequestBody Map<String, Object> cartData) {
        Integer bookID = (Integer) cartData.get("bookID");
        Integer quantity = cartData.containsKey("quantity") ? (Integer) cartData.get("quantity") : 1;
        String enchantment = cartData.containsKey("enchantment") ? (String) cartData.get("enchantment") : "";
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Check if book exists in cart
            List<Cart> existingItems = cartRepository.findByCartBookID(bookID);
            if (!existingItems.isEmpty()) {
                response.put("success", true);
                response.put("message", "Item is already in your cart");
                response.put("alreadyInCart", true);
                return ResponseEntity.ok(response);
            }
            
            // Get book details
            Optional<Book> bookOpt = bookRepository.findById(bookID);
            if (bookOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            Book book = bookOpt.get();
            
            // Create cart entry
            Cart cart = new Cart();
            cart.setCartBookID(bookID);
            cart.setBookName(book.getBookName());
            cart.setCategoryID(book.getCategoryID());
            cart.setCategoryName(book.getCategoryName());
            cart.setBookDescription(book.getBookDescription());
            cart.setPrice(book.getPrice());
            cart.setProPrice(book.getProPrice() != null ? book.getProPrice() : book.getPrice());
            cart.setQuantity(quantity);
            cart.setEnchantment(enchantment);
            
            cartRepository.save(cart);
            
            response.put("success", true);
            response.put("message", "Item added to cart successfully");
            response.put("cartID", cart.getCartID());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("error", "Failed to add item to cart");
            return ResponseEntity.ok(response);
        }
    }
    
    @DeleteMapping("/cart/remove/{id}")
    public ResponseEntity<Map<String, Object>> removeFromCart(@PathVariable Integer id) {
        Map<String, Object> response = new HashMap<>();
        try {
            cartRepository.deleteById(id);
            response.put("success", true);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("error", "Failed to remove item from cart");
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @PostMapping("/checkout")
    public ResponseEntity<Map<String, Object>> checkout(@RequestBody Map<String, List<Integer>> checkoutData) {
        List<Integer> cartIds = checkoutData.get("cartIds");
        Map<String, Object> response = new HashMap<>();
        
        try {
            List<Cart> cartItems = cartRepository.findAllById(cartIds);
            
            // Move to history (simplified - you'll need to implement History entity logic)
            
            // Remove from cart
            cartRepository.deleteAllById(cartIds);
            
            response.put("success", true);
            response.put("message", "Checkout completed successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("error", "Failed to complete checkout");
            return ResponseEntity.badRequest().body(response);
        }
    }
}

