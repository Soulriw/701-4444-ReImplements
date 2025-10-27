package com.quadgrimoire.repository;

import com.quadgrimoire.model.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface BookRepository extends JpaRepository<Book, Integer> {
    List<Book> findByCategoryID(Integer categoryID);
    List<Book> findByBookNameContainingIgnoreCaseOrBookDescriptionContainingIgnoreCase(String bookName, String description);
}

