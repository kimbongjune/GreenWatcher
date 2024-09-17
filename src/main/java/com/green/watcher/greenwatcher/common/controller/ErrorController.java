package com.green.watcher.greenwatcher.common.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 *  @author kim
 *  @since 2024.09.17
 *  @version 1.0.0
 *  인증 인가 / 404 에러 컨트롤러
 */
@Controller
@RequestMapping("/error")
public class ErrorController {

    @GetMapping("/403")
    public String error403(){
        return "error/error403";
    }

    @GetMapping("/404")
    public String error404(){
        return "error/error404";
    }
}
