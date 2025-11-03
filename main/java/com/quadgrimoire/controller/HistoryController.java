package com.quadgrimoire.controller;

import com.quadgrimoire.model.History;
import com.quadgrimoire.service.HistoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:3000"})
public class HistoryController {
    
    @Autowired
    private HistoryService historyService;
    
    @GetMapping("/history")
    public ResponseEntity<?> getHistory() {
        try {
            List<History> history = historyService.getAllHistory();
            System.out.println("Controller: Returning " + (history != null ? history.size() : 0) + " history entries");
            if (history == null) {
                history = List.of();
            }
            return ResponseEntity.ok(history);
        } catch (Exception e) {
            System.err.println("Controller error fetching history: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", "Failed to fetch history: " + e.getMessage()));
        }
    }
    
    @GetMapping("/history/{id}")
    public ResponseEntity<History> getHistoryById(@PathVariable Integer id) {
        Optional<History> history = historyService.getHistoryById(id);
        return history.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }
    
    @GetMapping("/history/book/{bookId}")
    public ResponseEntity<List<History>> getHistoryByBookId(@PathVariable Integer bookId) {
        List<History> history = historyService.getHistoryByBookId(bookId);
        return ResponseEntity.ok(history);
    }
    
    @GetMapping("/history/category/{categoryId}")
    public ResponseEntity<List<History>> getHistoryByCategoryId(@PathVariable Integer categoryId) {
        List<History> history = historyService.getHistoryByCategoryId(categoryId);
        return ResponseEntity.ok(history);
    }
    
    @PostMapping("/history")
    public ResponseEntity<Map<String, Object>> addHistoryEntry(@RequestBody Map<String, Object> historyData) {
        Map<String, Object> response = historyService.addHistoryEntry(historyData);
        return response.get("success").equals(true) ? 
            ResponseEntity.ok(response) : 
            ResponseEntity.badRequest().body(response);
    }
    
    @GetMapping("/history/stats")
    public ResponseEntity<Map<String, Object>> getSalesStats() {
        Map<String, Object> stats = historyService.getSalesStats();
        return ResponseEntity.ok(stats);
    }
    
    @GetMapping("/history/top-books")
    public ResponseEntity<Map<String, Object>> getTopSellingBooks(@RequestParam(defaultValue = "10") Integer limit) {
        Map<String, Object> result = historyService.getTopSellingBooks(limit);
        return ResponseEntity.ok(result);
    }
    
    @DeleteMapping("/history/{id}")
    public ResponseEntity<Map<String, Object>> deleteHistoryEntry(@PathVariable Integer id) {
        Map<String, Object> response = historyService.deleteHistoryEntry(id);
        return response.get("success").equals(true) ? 
            ResponseEntity.ok(response) : 
            ResponseEntity.badRequest().body(response);
    }
}

