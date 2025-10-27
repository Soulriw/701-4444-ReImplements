package com.quadgrimoire.controller;

import com.quadgrimoire.model.Category;
import com.quadgrimoire.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:3000"})
public class CategoryController {
    
    @Autowired
    private CategoryService categoryService;
    
    @GetMapping("/categories")
    public ResponseEntity<List<Category>> getCategories() {
        List<Category> categories = categoryService.getAllCategories();
        return ResponseEntity.ok(categories);
    }
    
    @GetMapping("/categoryInfo/{id}")
    public ResponseEntity<Category> getCategoryInfo(@PathVariable Integer id) {
        Optional<Category> category = categoryService.getCategoryById(id);
        return category.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }
    
    @PostMapping("/categories")
    public ResponseEntity<Map<String, Object>> addCategory(@RequestBody Map<String, Object> categoryData) {
        Map<String, Object> response = categoryService.addCategory(categoryData);
        return response.get("success").equals(true) ? 
            ResponseEntity.ok(response) : 
            ResponseEntity.badRequest().body(response);
    }
    
    @PutMapping("/categories/{id}")
    public ResponseEntity<Map<String, Object>> updateCategory(@PathVariable Integer id, 
                                                               @RequestBody Map<String, Object> categoryData) {
        Map<String, Object> response = categoryService.updateCategory(id, categoryData);
        return response.get("success").equals(true) ? 
            ResponseEntity.ok(response) : 
            ResponseEntity.badRequest().body(response);
    }
    
    @DeleteMapping("/categories/{id}")
    public ResponseEntity<Map<String, Object>> deleteCategory(@PathVariable Integer id) {
        Map<String, Object> response = categoryService.deleteCategory(id);
        return response.get("success").equals(true) ? 
            ResponseEntity.ok(response) : 
            ResponseEntity.badRequest().body(response);
    }
    
    @GetMapping("/categories/stats")
    public ResponseEntity<Map<String, Object>> getCategoryStats() {
        Map<String, Object> stats = categoryService.getCategoryStats();
        return ResponseEntity.ok(stats);
    }
}

