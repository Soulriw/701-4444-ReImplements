package com.quadgrimoire.controller;

import com.quadgrimoire.model.History;
import com.quadgrimoire.repository.HistoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:3000"})
public class HistoryController {
    
    @Autowired
    private HistoryRepository historyRepository;
    
    @GetMapping("/history")
    public ResponseEntity<List<History>> getHistory() {
        List<History> history = historyRepository.findAllByOrderByHistoryIDDesc();
        return ResponseEntity.ok(history);
    }
}

