package com.green.watcher.greenwatcher.common.user.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@Slf4j
public class ApiTestController {
    @GetMapping("/test")
    public ResponseEntity<?> test(){
        log.info("?????????????");
        return ResponseEntity.ok("test");
    }
}
