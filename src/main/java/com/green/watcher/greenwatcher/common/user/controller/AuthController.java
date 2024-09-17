package com.green.watcher.greenwatcher.common.user.controller;

import com.green.watcher.greenwatcher.common.user.dto.UserRegistrationDTO;
import com.green.watcher.greenwatcher.common.user.security.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 *  @author kim
 *  @since 2024.09.17
 *  @version 1.0.0
 *  인증 인가 관련 컨트롤러
 *  로그인, 회원가입을 처리한다.
 */
@Controller
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;

    /*
     *  회원가입 뷰 컨틀로러
     *  회원가입 페이지를 표출한다.
     */
    @GetMapping("/register")
    public String register(){
        return "user/register";
    }

    /*
     *  회원가입 처리 컨트롤러
     *  회원정보를 데이터베이스에 삽입한다.
     */
    @PostMapping("/register")
    public String registerProcess(@ModelAttribute UserRegistrationDTO userDto){
        if(userService.registerUser(userDto)){
            return "redirect:/auth/login";
        }else{
            return "redirect:/auth/register";
        }
    }

    /*
     *  로그인 뷰 컨트롤러
     *  로그인 페이지를 표출한다.
     */
    @GetMapping("/login")
    public String login(){
        return "user/login";
    }

}
