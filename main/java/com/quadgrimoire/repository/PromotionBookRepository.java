package com.quadgrimoire.repository;

import com.quadgrimoire.model.PromotionBook;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PromotionBookRepository extends JpaRepository<PromotionBook, Integer> {
    PromotionBook findByBookID(Integer bookID);
}

