package com.quadgrimoire.service;

import com.quadgrimoire.model.Book;
import com.quadgrimoire.model.PromotionBook;
import com.quadgrimoire.repository.BookRepository;
import com.quadgrimoire.repository.PromotionBookRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class BookService {

    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private PromotionBookRepository promotionBookRepository;

    /**
     * Get all books
     * @return List of all books
     */
    public List<Book> getAllBooks() {
        return bookRepository.findAll();
    }

    /**
     * Get book by ID with promotion price if available
     * @param bookId The book ID
     * @return Optional containing the book
     */
    public Optional<Book> getBookById(Integer bookId) {
        Optional<Book> bookOpt = bookRepository.findById(bookId);
        if (bookOpt.isPresent()) {
            Book book = bookOpt.get();
            // Check for promotion
            PromotionBook promotionBook = promotionBookRepository.findByBookID(bookId);
            if (promotionBook != null) {
                book.setProPrice(promotionBook.getProPrice());
            }
            return Optional.of(book);
        }
        return Optional.empty();
    }

    /**
     * Get books by category
     * @param categoryId The category ID
     * @return List of books in the category
     */
    public List<Book> getBooksByCategory(Integer categoryId) {
        return bookRepository.findByCategoryID(categoryId);
    }

    /**
     * Search books by name or description
     * @param searchTerm The search term
     * @return List of matching books
     */
    public List<Book> searchBooks(String searchTerm) {
        if (searchTerm == null || searchTerm.trim().isEmpty()) {
            return List.of();
        }
        return bookRepository.findByBookNameContainingIgnoreCaseOrBookDescriptionContainingIgnoreCase(
                searchTerm.trim(), searchTerm.trim()
        );
    }

    /**
     * Get all promotion books
     * @return List of all promotion books
     */
    public List<PromotionBook> getPromotionBooks() {
        return promotionBookRepository.findAll();
    }

    /**
     * Add a new book
     * @param bookData Map containing book data
     * @return Map containing success status and error message if any
     */
    @Transactional
    public Map<String, Object> addBook(Map<String, Object> bookData) {
        Map<String, Object> response = new HashMap<>();

        try {
            // Validate required fields
            if (!bookData.containsKey("bookName") || bookData.get("bookName") == null ||
                    !bookData.containsKey("categoryID") || bookData.get("categoryID") == null ||
                    !bookData.containsKey("price") || bookData.get("price") == null) {
                response.put("success", false);
                response.put("error", "Missing required fields");
                return response;
            }

            Book book = new Book();

            // Set bookID if provided
            if (bookData.containsKey("bookID") && bookData.get("bookID") != null) {
                book.setBookID((Integer) bookData.get("bookID"));
            }

            book.setBookName((String) bookData.get("bookName"));
            book.setCategoryID((Integer) bookData.get("categoryID"));
            book.setCategoryName((String) bookData.get("categoryName"));
            book.setBookDescription((String) bookData.get("bookDescription"));

            // Handle price conversion
            Object priceObj = bookData.get("price");
            if (priceObj instanceof BigDecimal) {
                book.setPrice((BigDecimal) priceObj);
            } else if (priceObj instanceof Double) {
                book.setPrice(BigDecimal.valueOf((Double) priceObj));
            } else if (priceObj instanceof Integer) {
                book.setPrice(BigDecimal.valueOf((Integer) priceObj));
            }

            // Handle proPrice if provided
            if (bookData.containsKey("proPrice") && bookData.get("proPrice") != null) {
                Object proPriceObj = bookData.get("proPrice");
                if (proPriceObj instanceof BigDecimal) {
                    book.setProPrice((BigDecimal) proPriceObj);
                } else if (proPriceObj instanceof Double) {
                    book.setProPrice(BigDecimal.valueOf((Double) proPriceObj));
                } else if (proPriceObj instanceof Integer) {
                    book.setProPrice(BigDecimal.valueOf((Integer) proPriceObj));
                }
            }

            bookRepository.save(book);

            // Handle promotion book
            Boolean isPromotionBook = (Boolean) bookData.get("isPromotionBook");
            if (Boolean.TRUE.equals(isPromotionBook) && book.getProPrice() != null) {
                createPromotionBook(book);
            }

            response.put("success", true);
            response.put("bookID", book.getBookID());
            response.put("message", "Book added successfully");
            return response;
        } catch (Exception e) {
            response.put("success", false);
            response.put("error", "Failed to add book: " + e.getMessage());
            return response;
        }
    }

    /**
     * Update an existing book
     * @param bookId The book ID
     * @param bookData Map containing updated book data
     * @return Map containing success status and error message if any
     */
    @Transactional
    public Map<String, Object> updateBook(Integer bookId, Map<String, Object> bookData) {
        Map<String, Object> response = new HashMap<>();

        try {
            Optional<Book> existingBook = bookRepository.findById(bookId);
            if (existingBook.isEmpty()) {
                response.put("success", false);
                response.put("error", "Book not found");
                return response;
            }

            Book book = existingBook.get();

            // Update fields
            if (bookData.containsKey("bookName")) {
                book.setBookName((String) bookData.get("bookName"));
            }
            if (bookData.containsKey("categoryID")) {
                book.setCategoryID((Integer) bookData.get("categoryID"));
            }
            if (bookData.containsKey("categoryName")) {
                book.setCategoryName((String) bookData.get("categoryName"));
            }
            if (bookData.containsKey("bookDescription")) {
                book.setBookDescription((String) bookData.get("bookDescription"));
            }
            if (bookData.containsKey("price")) {
                Object priceObj = bookData.get("price");
                if (priceObj instanceof BigDecimal) {
                    book.setPrice((BigDecimal) priceObj);
                } else if (priceObj instanceof Double) {
                    book.setPrice(BigDecimal.valueOf((Double) priceObj));
                } else if (priceObj instanceof Integer) {
                    book.setPrice(BigDecimal.valueOf((Integer) priceObj));
                }
            }
            if (bookData.containsKey("proPrice")) {
                Object proPriceObj = bookData.get("proPrice");
                if (proPriceObj instanceof BigDecimal) {
                    book.setProPrice((BigDecimal) proPriceObj);
                } else if (proPriceObj instanceof Double) {
                    book.setProPrice(BigDecimal.valueOf((Double) proPriceObj));
                } else if (proPriceObj instanceof Integer) {
                    book.setProPrice(BigDecimal.valueOf((Integer) proPriceObj));
                }
            }

            bookRepository.save(book);

            // Handle promotion book
            PromotionBook promotionBook = promotionBookRepository.findByBookID(bookId);
            Boolean isPromotionBook = (Boolean) bookData.get("isPromotionBook");

            if (Boolean.TRUE.equals(isPromotionBook) && book.getProPrice() != null) {
                if (promotionBook == null) {
                    createPromotionBook(book);
                } else {
                    updatePromotionBook(promotionBook, book);
                }
            } else if (promotionBook != null) {
                promotionBookRepository.delete(promotionBook);
            }

            response.put("success", true);
            response.put("message", "Book updated successfully");
            return response;
        } catch (Exception e) {
            response.put("success", false);
            response.put("error", "Failed to update book: " + e.getMessage());
            return response;
        }
    }

    /**
     * Delete a book
     * @param bookId The book ID
     * @return Map containing success status and error message if any
     */
    @Transactional
    public Map<String, Object> deleteBook(Integer bookId) {
        Map<String, Object> response = new HashMap<>();

        try {
            // Delete promotion book if exists
            PromotionBook promotionBook = promotionBookRepository.findByBookID(bookId);
            if (promotionBook != null) {
                promotionBookRepository.delete(promotionBook);
            }

            // Delete the book
            bookRepository.deleteById(bookId);

            response.put("success", true);
            response.put("message", "Book deleted successfully");
            return response;
        } catch (Exception e) {
            response.put("success", false);
            response.put("error", "Failed to delete book: " + e.getMessage());
            return response;
        }
    }

    /**
     * Create a promotion book entry
     */
    private void createPromotionBook(Book book) {
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


    /**
     * Update a promotion book entry
     */
    private void updatePromotionBook(PromotionBook promotionBook, Book book) {
        promotionBook.setBookName(book.getBookName());
        promotionBook.setCategoryID(book.getCategoryID());
        promotionBook.setCategoryName(book.getCategoryName());
        promotionBook.setBookDescription(book.getBookDescription());
        promotionBook.setPrice(book.getPrice());
        promotionBook.setProPrice(book.getProPrice());
        promotionBookRepository.save(promotionBook);
    }
}