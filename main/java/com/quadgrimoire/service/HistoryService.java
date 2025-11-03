package com.quadgrimoire.service;

import com.quadgrimoire.model.History;
import com.quadgrimoire.repository.HistoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class HistoryService {

    @Autowired
    private HistoryRepository historyRepository;

    /**
     * Get all sales history
     * @return List of all sales history entries
     */
    public List<History> getAllHistory() {
        return historyRepository.findAll();
    }

    /**
     * Get sales history by ID
     * @param historyId The history ID
     * @return Optional containing the history entry
     */
    public Optional<History> getHistoryById(Integer historyId) {
        return historyRepository.findById(historyId);
    }

    /**
     * Get sales history by book ID
     * @param bookId The book ID
     * @return List of history entries for the book
     */
    public List<History> getHistoryByBookId(Integer bookId) {
        return historyRepository.findByBookID(bookId);
    }

    /**
     * Get sales history by category ID
     * @param categoryId The category ID
     * @return List of history entries for the category
     */
    public List<History> getHistoryByCategoryId(Integer categoryId) {
        return historyRepository.findByCategoryID(categoryId);
    }

    /**
     * Add a new sales history entry
     * @param historyData Map containing history data
     * @return Map containing success status and error message if any
     */
    public Map<String, Object> addHistoryEntry(Map<String, Object> historyData) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            History history = new History();
            
            // Set book information
            if (historyData.get("bookID") != null) {
                history.setBookID((Integer) historyData.get("bookID"));
            }
            if (historyData.get("bookName") != null) {
                history.setBookName((String) historyData.get("bookName"));
            }
            if (historyData.get("categoryID") != null) {
                history.setCategoryID((Integer) historyData.get("categoryID"));
            }
            if (historyData.get("categoryName") != null) {
                history.setCategoryName((String) historyData.get("categoryName"));
            }
            if (historyData.get("quantity") != null) {
                history.setQuantity((Integer) historyData.get("quantity"));
            }
            if (historyData.get("sellPrice") != null) {
                history.setSellPrice((BigDecimal) historyData.get("sellPrice"));
            }
            if (historyData.get("enchantment") != null) {
                history.setEnchantment((String) historyData.get("enchantment"));
            }
            
            // Set timestamp
            history.setSellDate(LocalDateTime.now());
            
            historyRepository.save(history);
            
            response.put("success", true);
            response.put("message", "History entry added successfully");
            response.put("history", history);
            return response;
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("error", "Failed to add history entry: " + e.getMessage());
            e.printStackTrace();
            return response;
        }
    }

    /**
     * Get sales statistics
     * @return Map containing sales statistics
     */
    public Map<String, Object> getSalesStats() {
        Map<String, Object> stats = new HashMap<>();
        
        try {
            List<History> allHistory = historyRepository.findAll();
            
            int totalSales = allHistory.size();
            BigDecimal totalRevenue = BigDecimal.ZERO;
            int totalQuantitySold = 0;
            
            for (History entry : allHistory) {
                if (entry.getSellPrice() != null && entry.getQuantity() != null) {
                    totalRevenue = totalRevenue.add(
                        entry.getSellPrice().multiply(BigDecimal.valueOf(entry.getQuantity()))
                    );
                    totalQuantitySold += entry.getQuantity();
                }
            }
            
            stats.put("totalSales", totalSales);
            stats.put("totalRevenue", totalRevenue);
            stats.put("totalQuantitySold", totalQuantitySold);
            stats.put("averageOrderValue", totalSales > 0 ? 
                totalRevenue.divide(BigDecimal.valueOf(totalSales), 2, java.math.RoundingMode.HALF_UP) : 
                BigDecimal.ZERO);
            
            return stats;
            
        } catch (Exception e) {
            stats.put("error", "Failed to get sales statistics: " + e.getMessage());
            return stats;
        }
    }

    /**
     * Get sales history for a specific date range
     * @param startDate Start date (optional)
     * @param endDate End date (optional)
     * @return List of history entries in the date range
     */
    public List<History> getHistoryByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        if (startDate == null && endDate == null) {
            return historyRepository.findAll();
        }
        
        if (startDate == null) {
            return historyRepository.findBySellDateBefore(endDate);
        }
        
        if (endDate == null) {
            return historyRepository.findBySellDateAfter(startDate);
        }
        
        return historyRepository.findBySellDateBetween(startDate, endDate);
    }

    /**
     * Get top selling books
     * @param limit Number of top books to return
     * @return List of top selling books with quantities
     */
    public Map<String, Object> getTopSellingBooks(Integer limit) {
        Map<String, Object> result = new HashMap<>();
        
        try {
            List<History> allHistory = historyRepository.findAll();
            Map<Integer, Integer> bookQuantities = new HashMap<>();
            Map<Integer, String> bookNames = new HashMap<>();
            
            // Aggregate quantities by book ID
            for (History entry : allHistory) {
                if (entry.getBookID() != null && entry.getQuantity() != null) {
                    Integer bookId = entry.getBookID();
                    Integer quantity = entry.getQuantity();
                    
                    bookQuantities.put(bookId, bookQuantities.getOrDefault(bookId, 0) + quantity);
                    if (entry.getBookName() != null) {
                        bookNames.put(bookId, entry.getBookName());
                    }
                }
            }
            
            // Sort by quantity and get top books
            List<Map<String, Object>> topBooks = bookQuantities.entrySet().stream()
                .sorted((e1, e2) -> e2.getValue().compareTo(e1.getValue()))
                .limit(limit != null ? limit : 10)
                .map(entry -> {
                    Map<String, Object> book = new HashMap<>();
                    book.put("bookID", entry.getKey());
                    book.put("bookName", bookNames.get(entry.getKey()));
                    book.put("totalQuantitySold", entry.getValue());
                    return book;
                })
                .toList();
            
            result.put("success", true);
            result.put("topBooks", topBooks);
            return result;
            
        } catch (Exception e) {
            result.put("success", false);
            result.put("error", "Failed to get top selling books: " + e.getMessage());
            return result;
        }
    }

    /**
     * Delete history entry
     * @param historyId The history ID to delete
     * @return Map containing success status
     */
    public Map<String, Object> deleteHistoryEntry(Integer historyId) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            Optional<History> historyOpt = historyRepository.findById(historyId);
            if (historyOpt.isEmpty()) {
                response.put("success", false);
                response.put("error", "History entry not found");
                return response;
            }
            
            historyRepository.deleteById(historyId);
            
            response.put("success", true);
            response.put("message", "History entry deleted successfully");
            return response;
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("error", "Failed to delete history entry: " + e.getMessage());
            return response;
        }
    }
}
