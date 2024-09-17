package com.green.watcher.greenwatcher.common.user.controller;

import com.green.watcher.greenwatcher.common.dto.UserRegistrationDTO;
import com.green.watcher.greenwatcher.common.user.security.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;

    @GetMapping("/register")
    public String register(){
        return "user/register";
    }

    @GetMapping("/login")
    public String login(){
        return "user/login";
    }

    @PostMapping("/register")
    public String registerProcess(@ModelAttribute UserRegistrationDTO userDto){
        if(userService.registerUser(userDto)){
            return "redirect:/auth/login";
        }else{
            return "redirect:/auth/register";
        }
    }
}
