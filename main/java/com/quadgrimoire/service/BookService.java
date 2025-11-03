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

            // Generate bookID if not provided
            Integer bookID = null;
            if (bookData.containsKey("bookID") && bookData.get("bookID") != null) {
                Object bookIDObj = bookData.get("bookID");
                if (bookIDObj instanceof Integer) {
                    bookID = (Integer) bookIDObj;
                } else if (bookIDObj instanceof Number) {
                    bookID = ((Number) bookIDObj).intValue();
                }
            }
            
            // If bookID is not provided or invalid, find the max bookID and add 1
            if (bookID == null || bookID <= 0) {
                List<Book> allBooks = bookRepository.findAll();
                if (allBooks.isEmpty()) {
                    bookID = 1;
                } else {
                    int maxID = 0;
                    for (Book b : allBooks) {
                        Integer id = b.getBookID();
                        if (id != null && id > maxID) {
                            maxID = id;
                        }
                    }
                    bookID = maxID + 1;
                }
            }
            book.setBookID(bookID);

            book.setBookName((String) bookData.get("bookName"));
            book.setCategoryID((Integer) bookData.get("categoryID"));
            
            // Handle categoryName - ensure it's not null
            String categoryName = (String) bookData.get("categoryName");
            if (categoryName == null || categoryName.trim().isEmpty()) {
                categoryName = "Unknown";
            }
            book.setCategoryName(categoryName);
            
            // Handle bookDescription - can be null
            String bookDescription = (String) bookData.get("bookDescription");
            book.setBookDescription(bookDescription != null ? bookDescription : "");

            // Handle price conversion
            Object priceObj = bookData.get("price");
            if (priceObj == null) {
                response.put("success", false);
                response.put("error", "Price is required");
                return response;
            }
            
            BigDecimal price;
            if (priceObj instanceof BigDecimal) {
                price = (BigDecimal) priceObj;
            } else if (priceObj instanceof Double) {
                Double doubleValue = (Double) priceObj;
                if (doubleValue.isNaN() || doubleValue.isInfinite()) {
                    response.put("success", false);
                    response.put("error", "Invalid price value");
                    return response;
                }
                price = BigDecimal.valueOf(doubleValue);
            } else if (priceObj instanceof Integer) {
                price = BigDecimal.valueOf((Integer) priceObj);
            } else if (priceObj instanceof Number) {
                price = BigDecimal.valueOf(((Number) priceObj).doubleValue());
            } else {
                try {
                    price = new BigDecimal(priceObj.toString());
                } catch (NumberFormatException e) {
                    response.put("success", false);
                    response.put("error", "Invalid price format");
                    return response;
                }
            }
            book.setPrice(price);

            // Handle proPrice if provided
            if (bookData.containsKey("proPrice") && bookData.get("proPrice") != null) {
                Object proPriceObj = bookData.get("proPrice");
                BigDecimal proPrice;
                if (proPriceObj instanceof BigDecimal) {
                    proPrice = (BigDecimal) proPriceObj;
                } else if (proPriceObj instanceof Double) {
                    Double doubleValue = (Double) proPriceObj;
                    if (doubleValue.isNaN() || doubleValue.isInfinite()) {
                        proPrice = null;
                    } else {
                        proPrice = BigDecimal.valueOf(doubleValue);
                    }
                } else if (proPriceObj instanceof Integer) {
                    proPrice = BigDecimal.valueOf((Integer) proPriceObj);
                } else if (proPriceObj instanceof Number) {
                    proPrice = BigDecimal.valueOf(((Number) proPriceObj).doubleValue());
                } else {
                    try {
                        proPrice = new BigDecimal(proPriceObj.toString());
                    } catch (NumberFormatException e) {
                        proPrice = null;
                    }
                }
                book.setProPrice(proPrice);
            }

            bookRepository.save(book);

            // Handle promotion book - convert string to boolean if needed
            Object isPromotionBookObj = bookData.get("isPromotionBook");
            Boolean isPromotionBook = false;
            if (isPromotionBookObj != null) {
                if (isPromotionBookObj instanceof Boolean) {
                    isPromotionBook = (Boolean) isPromotionBookObj;
                } else if (isPromotionBookObj instanceof String) {
                    isPromotionBook = "true".equalsIgnoreCase((String) isPromotionBookObj);
                }
            }
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

            // Handle promotion book - convert string to boolean if needed
            PromotionBook promotionBook = promotionBookRepository.findByBookID(bookId);
            Object isPromotionBookObj = bookData.get("isPromotionBook");
            Boolean isPromotionBook = false;
            if (isPromotionBookObj != null) {
                if (isPromotionBookObj instanceof Boolean) {
                    isPromotionBook = (Boolean) isPromotionBookObj;
                } else if (isPromotionBookObj instanceof String) {
                    isPromotionBook = "true".equalsIgnoreCase((String) isPromotionBookObj);
                }
            }

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