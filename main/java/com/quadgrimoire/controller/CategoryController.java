package com.quadgrimoire.controller;

import com.quadgrimoire.model.Category;
import com.quadgrimoire.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:3000"})
public class CategoryController {
    
    @Autowired
    private CategoryRepository categoryRepository;
    
    @GetMapping("/categories")
    public ResponseEntity<List<Category>> getCategories() {
        List<Category> categories = categoryRepository.findAll();
        return ResponseEntity.ok(categories);
    }
    
    @GetMapping("/categoryInfo/{id}")
    public ResponseEntity<Category> getCategoryInfo(@PathVariable Integer id) {
        Optional<Category> category = categoryRepository.findById(id);
        return category.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }
    
    @PostMapping("/categories")
    public ResponseEntity<Map<String, Object>> addCategory(@RequestBody Map<String, String> categoryData) {
        String categoryName = categoryData.get("categoryName");
        Map<String, Object> response = new HashMap<>();
        
        try {
            Category category = new Category();
            category.setCategoryName(categoryName.trim());
            categoryRepository.save(category);
            
            response.put("success", true);
            response.put("categoryID", category.getCategoryID());
            response.put("message", "Category added successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("error", "Failed to add category");
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @PutMapping("/categories/{id}")
    public ResponseEntity<Map<String, Object>> updateCategory(@PathVariable Integer id, 
                                                               @RequestBody Map<String, String> categoryData) {
        String categoryName = categoryData.get("categoryName");
        Map<String, Object> response = new HashMap<>();
        
        try {
            Optional<Category> categoryOpt = categoryRepository.findById(id);
            if (categoryOpt.isEmpty()) {
                response.put("error", "Category not found");
                return ResponseEntity.notFound().build();
            }
            
            Category category = categoryOpt.get();
            category.setCategoryName(categoryName.trim());
            categoryRepository.save(category);
            
            response.put("success", true);
            response.put("message", "Category updated successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("error", "Failed to update category");
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @DeleteMapping("/categories/{id}")
    public ResponseEntity<Map<String, Object>> deleteCategory(@PathVariable Integer id) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            categoryRepository.deleteById(id);
            response.put("success", true);
            response.put("message", "Category deleted successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("error", "Failed to delete category");
            return ResponseEntity.badRequest().body(response);
        }
    }
}

