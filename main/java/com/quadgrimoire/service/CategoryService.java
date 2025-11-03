package com.quadgrimoire.service;

import com.quadgrimoire.model.Category;
import com.quadgrimoire.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    /**
     * Get all categories
     * @return List of all categories
     */
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    /**
     * Get category by ID
     * @param categoryId The category ID
     * @return Optional containing the category
     */
    public Optional<Category> getCategoryById(Integer categoryId) {
        return categoryRepository.findById(categoryId);
    }

    /**
     * Get category by name
     * @param categoryName The category name
     * @return Optional containing the category
     */
    public Optional<Category> getCategoryByName(String categoryName) {
        return categoryRepository.findByCategoryName(categoryName);
    }

    /**
     * Add a new category
     * @param categoryData Map containing category data
     * @return Map containing success status and error message if any
     */
    @Transactional
    public Map<String, Object> addCategory(Map<String, Object> categoryData) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            String categoryName = (String) categoryData.get("categoryName");
            // String categoryDescription = (String) categoryData.get("categoryDescription"); // Not used as model doesn't have this field
            
            if (categoryName == null || categoryName.trim().isEmpty()) {
                response.put("success", false);
                response.put("error", "Category name is required");
                return response;
            }
            
            // Check if category already exists
            if (categoryRepository.findByCategoryName(categoryName).isPresent()) {
                response.put("success", false);
                response.put("error", "Category with this name already exists");
                return response;
            }
            
            Category category = new Category();
            category.setCategoryName(categoryName.trim());
            // Note: Category model doesn't have description field
            // if (categoryDescription != null) {
            //     category.setCategoryDescription(categoryDescription.trim());
            // }
            
            categoryRepository.save(category);
            
            response.put("success", true);
            response.put("message", "Category added successfully");
            response.put("category", category);
            return response;
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("error", "Failed to add category: " + e.getMessage());
            e.printStackTrace();
            return response;
        }
    }

    /**
     * Update an existing category
     * @param categoryId The category ID
     * @param categoryData Map containing updated category data
     * @return Map containing success status and error message if any
     */
    @Transactional
    public Map<String, Object> updateCategory(Integer categoryId, Map<String, Object> categoryData) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            Optional<Category> categoryOpt = categoryRepository.findById(categoryId);
            if (categoryOpt.isEmpty()) {
                response.put("success", false);
                response.put("error", "Category not found");
                return response;
            }
            
            Category category = categoryOpt.get();
            String categoryName = (String) categoryData.get("categoryName");
            // String categoryDescription = (String) categoryData.get("categoryDescription"); // Not used as model doesn't have this field
            
            if (categoryName != null && !categoryName.trim().isEmpty()) {
                // Check if another category with this name exists
                Optional<Category> existingCategory = categoryRepository.findByCategoryName(categoryName);
                if (existingCategory.isPresent() && !existingCategory.get().getCategoryID().equals(categoryId)) {
                    response.put("success", false);
                    response.put("error", "Another category with this name already exists");
                    return response;
                }
                category.setCategoryName(categoryName.trim());
            }
            
            // Note: Category model doesn't have description field
            // if (categoryDescription != null) {
            //     category.setCategoryDescription(categoryDescription.trim());
            // }
            
            categoryRepository.save(category);
            
            response.put("success", true);
            response.put("message", "Category updated successfully");
            response.put("category", category);
            return response;
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("error", "Failed to update category: " + e.getMessage());
            e.printStackTrace();
            return response;
        }
    }

    /**
     * Delete a category
     * @param categoryId The category ID
     * @return Map containing success status and error message if any
     */
    @Transactional
    public Map<String, Object> deleteCategory(Integer categoryId) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            Optional<Category> categoryOpt = categoryRepository.findById(categoryId);
            if (categoryOpt.isEmpty()) {
                response.put("success", false);
                response.put("error", "Category not found");
                return response;
            }
            
            // Check if category has associated books
            // Note: This would require a book repository to check for books with this category
            // For now, we'll allow deletion but this should be implemented based on business rules
            
            categoryRepository.deleteById(categoryId);
            
            response.put("success", true);
            response.put("message", "Category deleted successfully");
            return response;
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("error", "Failed to delete category: " + e.getMessage());
            e.printStackTrace();
            return response;
        }
    }

    /**
     * Get category statistics
     * @return Map containing category statistics
     */
    public Map<String, Object> getCategoryStats() {
        Map<String, Object> stats = new HashMap<>();
        
        try {
            List<Category> categories = categoryRepository.findAll();
            stats.put("totalCategories", categories.size());
            stats.put("categories", categories);
            return stats;
        } catch (Exception e) {
            stats.put("error", "Failed to get category statistics: " + e.getMessage());
            return stats;
        }
    }
}
