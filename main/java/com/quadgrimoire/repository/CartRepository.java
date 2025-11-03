package com.quadgrimoire.repository;

import com.quadgrimoire.model.Cart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CartRepository extends JpaRepository<Cart, Integer> {
    List<Cart> findByCartBookID(Integer bookID);
    
    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("DELETE FROM Cart c WHERE c.cartID IN :cartIds")
    void deleteByIdIn(@Param("cartIds") List<Integer> cartIds);
    
    @Query("SELECT SUM(c.quantity) FROM Cart c")
    Long getTotalCartCount();
}

