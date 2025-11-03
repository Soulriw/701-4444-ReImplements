package com.quadgrimoire.controller;

import com.quadgrimoire.model.Book;
import com.quadgrimoire.model.PromotionBook;
import com.quadgrimoire.service.BookService;
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
public class BookController {
    
    @Autowired
    private BookService bookService;
    
    @GetMapping("/allBooks")
    public ResponseEntity<List<Book>> getAllBooks() {
        List<Book> books = bookService.getAllBooks();
        return ResponseEntity.ok(books);
    }
    
    @GetMapping("/books")
    public ResponseEntity<List<Book>> getBooks() {
        List<Book> books = bookService.getAllBooks();
        return ResponseEntity.ok(books);
    }
    
    @GetMapping("/books/{id}")
    public ResponseEntity<Book> getBookById(@PathVariable Integer id) {
        Optional<Book> book = bookService.getBookById(id);
        return book.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }
    
    @GetMapping("/category/{id}")
    public ResponseEntity<List<Book>> getBooksByCategory(@PathVariable Integer id) {
        List<Book> books = bookService.getBooksByCategory(id);
        return ResponseEntity.ok(books);
    }
    
    @GetMapping("/promotionBooks")
    public ResponseEntity<List<PromotionBook>> getPromotionBooks() {
        List<PromotionBook> books = bookService.getPromotionBooks();
        return ResponseEntity.ok(books);
    }
    
    @PostMapping("/books")
    public ResponseEntity<?> addBook(@RequestBody BookRequest bookRequest) {
        try {
            Map<String, Object> bookData = new HashMap<>();
            bookData.put("bookID", bookRequest.getBookID());
            bookData.put("bookName", bookRequest.getBookName());
            bookData.put("categoryID", bookRequest.getCategoryID());
            bookData.put("categoryName", bookRequest.getCategoryName());
            bookData.put("bookDescription", bookRequest.getBookDescription());
            bookData.put("price", bookRequest.getPrice());
            bookData.put("proPrice", bookRequest.getProPrice());
            bookData.put("isPromotionBook", bookRequest.getIsPromotionBook());
            
            Map<String, Object> response = bookService.addBook(bookData);
            return response.get("success").equals(true) ? 
                ResponseEntity.ok(response) : 
                ResponseEntity.badRequest().body(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("error", "Failed to add book: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
    
    @PutMapping("/books/{id}")
    public ResponseEntity<?> updateBook(@PathVariable Integer id, @RequestBody BookRequest bookRequest) {
        try {
            Map<String, Object> bookData = new HashMap<>();
            bookData.put("bookID", id);
            bookData.put("bookName", bookRequest.getBookName());
            bookData.put("categoryID", bookRequest.getCategoryID());
            bookData.put("categoryName", bookRequest.getCategoryName());
            bookData.put("bookDescription", bookRequest.getBookDescription());
            bookData.put("price", bookRequest.getPrice());
            bookData.put("proPrice", bookRequest.getProPrice());
            bookData.put("isPromotionBook", bookRequest.getIsPromotionBook());
            
            Map<String, Object> response = bookService.updateBook(id, bookData);
            return response.get("success").equals(true) ? 
                ResponseEntity.ok(response) : 
                ResponseEntity.badRequest().body(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @DeleteMapping("/books/{id}")
    public ResponseEntity<?> deleteBook(@PathVariable Integer id) {
        try {
            Map<String, Object> response = bookService.deleteBook(id);
            return response.get("success").equals(true) ? 
                ResponseEntity.ok(response) : 
                ResponseEntity.badRequest().body(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @GetMapping("/search")
    public ResponseEntity<List<Book>> searchBooks(@RequestParam String term) {
        List<Book> books = bookService.searchBooks(term);
        return ResponseEntity.ok(books);
    }
    
    // DTO for book requests
    public static class BookRequest {
        private Integer bookID;
        private String bookName;
        private Integer categoryID;
        private String categoryName;
        private String bookDescription;
        private BigDecimal price;
        private BigDecimal proPrice;
        private Boolean isPromotionBook;
        
        // Getters and setters
        public Integer getBookID() { return bookID; }
        public void setBookID(Integer bookID) { this.bookID = bookID; }
        public String getBookName() { return bookName; }
        public void setBookName(String bookName) { this.bookName = bookName; }
        public Integer getCategoryID() { return categoryID; }
        public void setCategoryID(Integer categoryID) { this.categoryID = categoryID; }
        public String getCategoryName() { return categoryName; }
        public void setCategoryName(String categoryName) { this.categoryName = categoryName; }
        public String getBookDescription() { return bookDescription; }
        public void setBookDescription(String bookDescription) { this.bookDescription = bookDescription; }
        public BigDecimal getPrice() { return price; }
        public void setPrice(BigDecimal price) { this.price = price; }
        public BigDecimal getProPrice() { return proPrice; }
        public void setProPrice(BigDecimal proPrice) { this.proPrice = proPrice; }
        public Boolean getIsPromotionBook() { return isPromotionBook; }
        public void setIsPromotionBook(Boolean isPromotionBook) { this.isPromotionBook = isPromotionBook; }
    }
}

