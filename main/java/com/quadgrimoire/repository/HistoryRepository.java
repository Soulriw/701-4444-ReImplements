package com.quadgrimoire.repository;

import com.quadgrimoire.model.History;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface HistoryRepository extends JpaRepository<History, Integer> {
    List<History> findAllByOrderByHistoryIDDesc();
    List<History> findByBookID(Integer bookID);
    List<History> findByCategoryID(Integer categoryID);
    List<History> findBySellDateBefore(LocalDateTime date);
    List<History> findBySellDateAfter(LocalDateTime date);
    List<History> findBySellDateBetween(LocalDateTime startDate, LocalDateTime endDate);
}

