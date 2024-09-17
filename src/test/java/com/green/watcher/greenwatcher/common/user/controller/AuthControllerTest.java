package com.green.watcher.greenwatcher.common.user.controller;

import com.green.watcher.greenwatcher.common.user.entity.User;
import com.green.watcher.greenwatcher.common.user.enumerate.Role;
import com.green.watcher.greenwatcher.common.user.repository.UserRepository;
import jakarta.servlet.ServletException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.annotation.Rollback;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @BeforeEach
    @Transactional
    @Rollback
    public void setUp() throws Exception {
        // given
        User user = User.builder()
                .id("testuser")
                .nickname("testnickname")
                .email("testuser@example.com")
                .password(passwordEncoder.encode("password"))
                .role(Role.ROLE_USER)
                .build();

        // when
        userRepository.save(user);
    }

    @Test
    @Transactional
    @Rollback
    @DisplayName("회원가입 성공")
    public void testUserRegistrationSuccess() throws Exception {
        // 회원가입을 따로 처리 (beforeEach와 중복되지 않도록 새 사용자 등록)
        mockMvc.perform(post("/auth/register")
                        .param("id", "newuser")
                        .param("nickname", "newnickname")
                        .param("email", "newuser@example.com")
                        .param("password", "password"))
                .andExpect(status().is3xxRedirection())
                .andExpect(redirectedUrl("/auth/login"));
    }

    @Test
    @Transactional
    @Rollback
    @DisplayName("회원가입 실패")
    public void testUserRegistrationFailure() throws Exception {
        // 이미 등록된 사용자

        // ServletException을 예상
        Exception exception = assertThrows(ServletException.class, () -> {
            mockMvc.perform(post("/auth/register")
                            .param("id", "testuser")
                            .param("nickname", "testnickname2")
                            .param("email", "testuser2@example.com")
                            .param("password", "password"))
                    .andExpect(status().is3xxRedirection())
                    .andExpect(redirectedUrl("/auth/register"));
        });

        // ServletException 내부에 있는 DataIntegrityViolationException을 확인
        Throwable cause = exception.getCause();
        assertTrue(cause instanceof DataIntegrityViolationException, "이미 존재하는 유저로 인한 DataIntegrityViolationException이 발생해야 합니다.");
    }

    @Test
    @DisplayName("로그인 성공")
    public void testLoginSuccess() throws Exception {
        // 회원가입을 먼저 수행

        mockMvc.perform(post("/auth/login")
                        .param("id", "testuser")
                        .param("password", "password"))
                .andExpect(status().is3xxRedirection())
                .andExpect(redirectedUrl("/map"));
    }

    @Test
    @DisplayName("로그인 실패")
    public void testLoginFailure() throws Exception {
        mockMvc.perform(post("/auth/login")
                        .param("id", "testuser")
                        .param("password", "wrongpassword"))
                .andExpect(status().is3xxRedirection())
                .andExpect(redirectedUrl("/auth/login?error=true"));
    }

    @Test
    @DisplayName("권한 인증 성공")
    public void testAccessUserPage() throws Exception {
        // 로그인 후 사용자 페이지 접근

        mockMvc.perform(get("/map")
                        .with(user("testuser").roles("USER")))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("권한 인증 실패")
    public void testAccessDeniedForAdminPage() throws Exception {
        mockMvc.perform(get("/admin/dashboard")
                        .with(user("testuser").roles("USER")))
                .andExpect(status().isForbidden())
                .andExpect(forwardedUrl("/error/403"));
    }

    @Test
    @DisplayName("로그아웃")
    public void testLogout() throws Exception {
        mockMvc.perform(post("/auth/logout")
                        .with(user("testuser").roles("USER"))
                        .with(csrf()))
                .andExpect(status().is3xxRedirection())
                .andExpect(redirectedUrl("/auth/login?logout=true"));
    }
}