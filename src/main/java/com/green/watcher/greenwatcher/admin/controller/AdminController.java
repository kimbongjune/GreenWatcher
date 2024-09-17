package com.green.watcher.greenwatcher.admin.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 *  @author kim
 *  @since 2024.09.17
 *  @version 1.0.0
 *  관리자 url 테스트용 컨트롤러
 */
@Controller
@RequestMapping("/admin")
public class AdminController {

    @GetMapping("/dashboard")
    public String dashboardPage(){
        return "admin/dashboard";
    }
}
