package com.quadgrimoire.controller;

import com.quadgrimoire.model.Book;
import com.quadgrimoire.model.PromotionBook;
import com.quadgrimoire.repository.BookRepository;
import com.quadgrimoire.repository.PromotionBookRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:3000"})
public class BookController {
    
    @Autowired
    private BookRepository bookRepository;
    
    @Autowired
    private PromotionBookRepository promotionBookRepository;
    
    @GetMapping("/allBooks")
    public ResponseEntity<List<Book>> getAllBooks() {
        List<Book> books = bookRepository.findAll();
        return ResponseEntity.ok(books);
    }
    
    @GetMapping("/books")
    public ResponseEntity<List<Book>> getBooks() {
        List<Book> books = bookRepository.findAll();
        return ResponseEntity.ok(books);
    }
    
    @GetMapping("/books/{id}")
    public ResponseEntity<Book> getBookById(@PathVariable Integer id) {
        Optional<Book> book = bookRepository.findById(id);
        if (book.isPresent()) {
            Book bookData = book.get();
            
            // Check for promotion
            PromotionBook promotionBook = promotionBookRepository.findByBookID(id);
            if (promotionBook != null) {
                bookData.setProPrice(promotionBook.getProPrice());
            }
            
            return ResponseEntity.ok(bookData);
        }
        return ResponseEntity.notFound().build();
    }
    
    @GetMapping("/category/{id}")
    public ResponseEntity<List<Book>> getBooksByCategory(@PathVariable Integer id) {
        List<Book> books = bookRepository.findByCategoryID(id);
        return ResponseEntity.ok(books);
    }
    
    @GetMapping("/promotionBooks")
    public ResponseEntity<List<PromotionBook>> getPromotionBooks() {
        List<PromotionBook> books = promotionBookRepository.findAll();
        return ResponseEntity.ok(books);
    }
    
    @PostMapping("/books")
    public ResponseEntity<?> addBook(@RequestBody BookRequest bookRequest) {
        try {
            Book book = new Book();
            book.setBookID(bookRequest.getBookID());
            book.setBookName(bookRequest.getBookName());
            book.setCategoryID(bookRequest.getCategoryID());
            book.setCategoryName(bookRequest.getCategoryName());
            book.setBookDescription(bookRequest.getBookDescription());
            book.setPrice(bookRequest.getPrice());
            book.setProPrice(bookRequest.getProPrice());
            
            bookRepository.save(book);
            
            if (bookRequest.getIsPromotionBook() != null && bookRequest.getIsPromotionBook()) {
                PromotionBook promotionBook = new PromotionBook();
                promotionBook.setBookID(book.getBookID());
                promotionBook.setBookName(book.getBookName());
                promotionBook.setCategoryID(book.getCategoryID());
                promotionBook.setCategoryName(book.getCategoryName());
                promotionBook.setBookDescription(book.getBookDescription());
                promotionBook.setPrice(book.getPrice());
                promotionBook.setProPrice(book.getProPrice());
                promotionBookRepository.save(promotionBook);
            }
            
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @PutMapping("/books/{id}")
    public ResponseEntity<?> updateBook(@PathVariable Integer id, @RequestBody BookRequest bookRequest) {
        Optional<Book> existingBook = bookRepository.findById(id);
        if (existingBook.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        Book book = existingBook.get();
        book.setBookName(bookRequest.getBookName());
        book.setCategoryID(bookRequest.getCategoryID());
        book.setCategoryName(bookRequest.getCategoryName());
        book.setBookDescription(bookRequest.getBookDescription());
        book.setPrice(bookRequest.getPrice());
        book.setProPrice(bookRequest.getProPrice());
        
        bookRepository.save(book);
        
        // Handle promotion book
        PromotionBook promotionBook = promotionBookRepository.findByBookID(id);
        if (bookRequest.getIsPromotionBook() != null && bookRequest.getIsPromotionBook()) {
            if (promotionBook == null) {
                promotionBook = new PromotionBook();
                promotionBook.setBookID(id);
            }
            promotionBook.setBookName(book.getBookName());
            promotionBook.setCategoryID(book.getCategoryID());
            promotionBook.setCategoryName(book.getCategoryName());
            promotionBook.setBookDescription(book.getBookDescription());
            promotionBook.setPrice(book.getPrice());
            promotionBook.setProPrice(book.getProPrice());
            promotionBookRepository.save(promotionBook);
        } else if (promotionBook != null) {
            promotionBookRepository.delete(promotionBook);
        }
        
        return ResponseEntity.ok().build();
    }
    
    @DeleteMapping("/books/{id}")
    public ResponseEntity<?> deleteBook(@PathVariable Integer id) {
        try {
            bookRepository.deleteById(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @GetMapping("/search")
    public ResponseEntity<List<Book>> searchBooks(@RequestParam String term) {
        List<Book> books = bookRepository.findByBookNameContainingIgnoreCaseOrBookDescriptionContainingIgnoreCase(term, term);
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

