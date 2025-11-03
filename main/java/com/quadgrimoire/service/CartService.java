package com.quadgrimoire.service;

import com.quadgrimoire.model.Cart;
import com.quadgrimoire.model.Book;
import com.quadgrimoire.model.History;
import com.quadgrimoire.model.PromotionBook;
import com.quadgrimoire.repository.CartRepository;
import com.quadgrimoire.repository.BookRepository;
import com.quadgrimoire.repository.HistoryRepository;
import com.quadgrimoire.repository.PromotionBookRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class CartService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private HistoryRepository historyRepository;

    @Autowired
    private PromotionBookRepository promotionBookRepository;

    /**
     * Get all cart items
     * @return List of cart items
     */
    public List<Cart> getAllCartItems() {
        return cartRepository.findAll();
    }

    /**
     * Get total count of items in cart
     * @return Total quantity of all items in cart
     */
    public Long getCartCount() {
        Long count = cartRepository.getTotalCartCount();
        return count != null ? count : 0L;
    }

    /**
     * Add item to cart
     * @param cartData Map containing cart data
     * @return Map containing success status and error message if any
     */
    @Transactional
    public Map<String, Object> addToCart(Map<String, Object> cartData) {
        Map<String, Object> response = new HashMap<>();

        try {
            // Validate required fields
            if (!cartData.containsKey("bookID") || cartData.get("bookID") == null) {
                response.put("success", false);
                response.put("error", "Book ID is required");
                return response;
            }

            Integer bookID = (Integer) cartData.get("bookID");
            Integer quantity = cartData.containsKey("quantity") ? (Integer) cartData.get("quantity") : 1;
            String enchantment = cartData.containsKey("enchantment") ? (String) cartData.get("enchantment") : "";

            // Validate quantity
            if (quantity < 1 || quantity > 99) {
                response.put("success", false);
                response.put("error", "Quantity must be between 1 and 99");
                return response;
            }

            // Check if book already exists in cart
            List<Cart> existingItems = cartRepository.findByCartBookID(bookID);
            if (!existingItems.isEmpty()) {
                response.put("success", true);
                response.put("message", "Item is already in your cart");
                response.put("alreadyInCart", true);
                return response;
            }

            // Get book details
            Optional<Book> bookOpt = bookRepository.findById(bookID);
            if (bookOpt.isEmpty()) {
                response.put("success", false);
                response.put("error", "Book not found");
                return response;
            }

            Book book = bookOpt.get();

            // Check if book has promotion
            PromotionBook promotionBook = promotionBookRepository.findByBookID(bookID);
            BigDecimal promotionPrice = null;
            
            if (promotionBook != null && promotionBook.getProPrice() != null) {
                promotionPrice = promotionBook.getProPrice();
            } else if (book.getProPrice() != null) {
                promotionPrice = book.getProPrice();
            }

            // Create cart entry
            Cart cart = new Cart();
            cart.setCartBookID(bookID);
            cart.setBookName(book.getBookName());
            cart.setCategoryID(book.getCategoryID());
            cart.setCategoryName(book.getCategoryName());
            cart.setBookDescription(book.getBookDescription());
            cart.setPrice(book.getPrice());
            cart.setProPrice(promotionPrice);
            cart.setQuantity(quantity);
            cart.setEnchantment(enchantment);

            cartRepository.save(cart);

            response.put("success", true);
            response.put("message", "Item added to cart successfully");
            response.put("cartID", cart.getCartID());
            return response;
        } catch (Exception e) {
            response.put("success", false);
            response.put("error", "Failed to add item to cart: " + e.getMessage());
            return response;
        }
    }

    /**
     * Update cart item quantity
     * @param cartId The cart ID
     * @param quantity The new quantity
     * @return Map containing success status and error message if any
     */
    @Transactional
    public Map<String, Object> updateCartQuantity(Integer cartId, Integer quantity) {
        Map<String, Object> response = new HashMap<>();

        try {
            if (quantity < 1 || quantity > 99) {
                response.put("success", false);
                response.put("error", "Quantity must be between 1 and 99");
                return response;
            }

            Optional<Cart> cartOpt = cartRepository.findById(cartId);
            if (cartOpt.isEmpty()) {
                response.put("success", false);
                response.put("error", "Cart item not found");
                return response;
            }

            Cart cart = cartOpt.get();
            cart.setQuantity(quantity);
            cartRepository.save(cart);

            response.put("success", true);
            response.put("message", "Cart updated successfully");
            return response;
        } catch (Exception e) {
            response.put("success", false);
            response.put("error", "Failed to update cart: " + e.getMessage());
            return response;
        }
    }

    /**
     * Remove item from cart
     * @param cartId The cart ID
     * @return Map containing success status and error message if any
     */
    @Transactional
    public Map<String, Object> removeFromCart(Integer cartId) {
        Map<String, Object> response = new HashMap<>();

        try {
            if (!cartRepository.existsById(cartId)) {
                response.put("success", false);
                response.put("error", "Cart item not found");
                return response;
            }

            cartRepository.deleteById(cartId);

            response.put("success", true);
            response.put("message", "Item removed from cart successfully");
            return response;
        } catch (Exception e) {
            response.put("success", false);
            response.put("error", "Failed to remove item from cart: " + e.getMessage());
            return response;
        }
    }

    /**
     * Clear all items from cart
     * @return Map containing success status and error message if any
     */
    @Transactional
    public Map<String, Object> clearCart() {
        Map<String, Object> response = new HashMap<>();

        try {
            cartRepository.deleteAll();

            response.put("success", true);
            response.put("message", "Cart cleared successfully");
            return response;
        } catch (Exception e) {
            response.put("success", false);
            response.put("error", "Failed to clear cart: " + e.getMessage());
            return response;
        }
    }

    /**
     * Process checkout for selected cart items
     * @param cartIds List of cart IDs to checkout
     * @return Map containing success status and error message if any
     */
    @Transactional
    public Map<String, Object> checkout(List<Integer> cartIds) {
        Map<String, Object> response = new HashMap<>();

        if (cartIds == null || cartIds.isEmpty()) {
            response.put("success", false);
            response.put("error", "No items selected for checkout");
            return response;
        }

        List<Cart> cartItems = cartRepository.findAllById(cartIds);

        if (cartItems.isEmpty()) {
            response.put("success", false);
            response.put("error", "No cart items found");
            return response;
        }

        // Convert cart items to history entries
        List<History> historyEntries = new ArrayList<>();
        BigDecimal totalAmount = BigDecimal.ZERO;
        BigDecimal totalNormalAmount = BigDecimal.ZERO;
        BigDecimal totalPromotionAmount = BigDecimal.ZERO;

        for (Cart cartItem : cartItems) {
            History history = new History();
            history.setBookID(cartItem.getCartBookID());
            history.setBookName(cartItem.getBookName());
            history.setCategoryID(cartItem.getCategoryID());
            history.setCategoryName(cartItem.getCategoryName());
            history.setQuantity(cartItem.getQuantity() != null ? cartItem.getQuantity() : 1);

            // Use promotion price if available, otherwise use regular price
            BigDecimal sellPrice = cartItem.getProPrice() != null ?
                    cartItem.getProPrice() : cartItem.getPrice();
            history.setSellPrice(sellPrice);
            history.setEnchantment(cartItem.getEnchantment() != null ? cartItem.getEnchantment() : "");
            // Note: sellDate is not set as the database table doesn't have this column

            historyEntries.add(history);

            // Calculate totals
            BigDecimal normalPrice = cartItem.getPrice();
            Integer quantity = cartItem.getQuantity() != null ? cartItem.getQuantity() : 1;
            BigDecimal itemTotal = sellPrice.multiply(BigDecimal.valueOf(quantity));
            BigDecimal normalTotal = normalPrice.multiply(BigDecimal.valueOf(quantity));
            
            totalAmount = totalAmount.add(itemTotal);
            totalNormalAmount = totalNormalAmount.add(normalTotal);
            
            if (cartItem.getProPrice() != null) {
                totalPromotionAmount = totalPromotionAmount.add(itemTotal);
            }
        }

        // Save all history entries
        historyRepository.saveAll(historyEntries);

        // Remove from cart - delete by ID using standard JPA method
        cartRepository.deleteAllById(cartIds);

        response.put("success", true);
        response.put("message", "Checkout completed successfully");
        response.put("totalAmount", totalAmount);
        response.put("totalNormalAmount", totalNormalAmount);
        response.put("totalPromotionAmount", totalPromotionAmount);
        response.put("totalSavings", totalNormalAmount.subtract(totalAmount));
        response.put("itemCount", cartItems.size());
        return response;
    }

    /**
     * Get cart summary
     * @return Map containing cart statistics
     */
    public Map<String, Object> getCartSummary() {
        List<Cart> cartItems = cartRepository.findAll();

        int totalItems = 0;
        BigDecimal totalPrice = BigDecimal.ZERO;
        BigDecimal totalNormalPrice = BigDecimal.ZERO;
        BigDecimal totalPromotionPrice = BigDecimal.ZERO;

        for (Cart item : cartItems) {
            totalItems += item.getQuantity();
            
            // Calculate normal price total
            BigDecimal normalPrice = item.getPrice();
            totalNormalPrice = totalNormalPrice.add(
                    normalPrice.multiply(BigDecimal.valueOf(item.getQuantity()))
            );
            
            // Calculate promotion price total if available
            if (item.getProPrice() != null) {
                totalPromotionPrice = totalPromotionPrice.add(
                        item.getProPrice().multiply(BigDecimal.valueOf(item.getQuantity()))
                );
                totalPrice = totalPrice.add(
                        item.getProPrice().multiply(BigDecimal.valueOf(item.getQuantity()))
                );
            } else {
                totalPrice = totalPrice.add(
                        normalPrice.multiply(BigDecimal.valueOf(item.getQuantity()))
                );
            }
        }

        Map<String, Object> summary = new HashMap<>();
        summary.put("itemCount", cartItems.size());
        summary.put("totalQuantity", totalItems);
        summary.put("totalPrice", totalPrice);
        summary.put("totalNormalPrice", totalNormalPrice);
        summary.put("totalPromotionPrice", totalPromotionPrice);
        summary.put("totalSavings", totalNormalPrice.subtract(totalPrice));

        return summary;
    }
}