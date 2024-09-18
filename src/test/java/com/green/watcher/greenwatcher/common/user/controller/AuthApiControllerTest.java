package com.green.watcher.greenwatcher.common.user.controller;

import com.green.watcher.greenwatcher.common.config.SecurityConfig;
import com.green.watcher.greenwatcher.common.user.dto.UserApiResponse;
import com.green.watcher.greenwatcher.common.user.dto.UserRegistrationDTO;
import com.green.watcher.greenwatcher.common.user.security.jwt.JwtTokenProvider;
import com.green.watcher.greenwatcher.common.user.security.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultHandlers;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;

@SpringBootTest
@AutoConfigureMockMvc
@Import(SecurityConfig.class)
class AuthApiControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AuthenticationManager authenticationManager;

    @MockBean
    private JwtTokenProvider jwtTokenProvider;

    @MockBean
    private UserService userService;

    @MockBean
    private PasswordEncoder passwordEncoder;

    private UserRegistrationDTO signUpRequest;
    private UserRegistrationDTO loginRequest;

    @BeforeEach
    void setUp() {
        signUpRequest = new UserRegistrationDTO("testId", "testNickname", "testEmail@test.com", "testPassword");
        loginRequest = new UserRegistrationDTO("testId", null, null, "testPassword");
    }

    @Test
    @DisplayName("회원가입 성공 테스트")
    @WithMockUser
    void signup_success() throws Exception {
        // 회원가입 로직 모킹: registerUser가 true를 반환하도록 설정
        given(userService.registerUser(any(UserRegistrationDTO.class))).willReturn(true);

        mockMvc.perform(MockMvcRequestBuilders.post("/api/auth/signup")
                        .with(SecurityMockMvcRequestPostProcessors.csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"id\":\"testId\", \"nickname\":\"testNickname\", \"email\":\"testEmail@test.com\", \"password\":\"testPassword\"}"))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.statusCode").value(200))
                .andExpect(MockMvcResultMatchers.jsonPath("$.message").value("성공"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.data").value("회원가입이 완료되었습니다."))
                .andDo(print());
    }

    @Test
    @DisplayName("회원가입 실패 테스트")
    @WithMockUser
    void signup_failure() throws Exception {
        // 회원가입 로직 모킹: DataIntegrityViolationException을 발생시키도록 설정
        given(userService.registerUser(any(UserRegistrationDTO.class)))
                .willThrow(new DataIntegrityViolationException("Duplicate entry"));

        mockMvc.perform(MockMvcRequestBuilders.post("/api/auth/signup")
                        .with(SecurityMockMvcRequestPostProcessors.csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"id\":\"testId\", \"nickname\":\"testNickname\", \"email\":\"testEmail@test.com\", \"password\":\"testPassword\"}"))
                .andExpect(MockMvcResultMatchers.status().isConflict())  // 409 상태 코드
                .andExpect(MockMvcResultMatchers.jsonPath("$.statusCode").value(409))
                .andExpect(MockMvcResultMatchers.jsonPath("$.message").value("회원가입에 실패했습니다"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.data").isEmpty())
                .andDo(print());
    }

    @Test
    @DisplayName("로그인 성공 테스트")
    @WithMockUser
    void login_success() throws Exception {
        // 로그인 시 사용자 인증 성공 모킹
        Authentication authentication = new UsernamePasswordAuthenticationToken("testId", "testPassword");
        given(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).willReturn(authentication);
        given(jwtTokenProvider.createToken(anyString(), any(Authentication.class))).willReturn("testToken");

        mockMvc.perform(MockMvcRequestBuilders.post("/api/auth/login")
                        .with(SecurityMockMvcRequestPostProcessors.csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"id\":\"testId\", \"password\":\"testPassword\"}"))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.statusCode").value(200))
                .andExpect(MockMvcResultMatchers.jsonPath("$.message").value("성공"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.data").value("testToken"))
                .andDo(print());
    }

    @Test
    @DisplayName("로그인 실패 테스트")
    @WithMockUser
    void login_failure() throws Exception {
        // 로그인 시 인증 실패 모킹
        given(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .willThrow(new AuthenticationException("로그인 실패") {});

        mockMvc.perform(MockMvcRequestBuilders.post("/api/auth/login")
                        .with(SecurityMockMvcRequestPostProcessors.csrf())  // CSRF 토큰 추가
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"id\":\"wrongId\", \"password\":\"wrongPassword\"}"))
                .andExpect(MockMvcResultMatchers.status().isUnauthorized())
                .andExpect(MockMvcResultMatchers.jsonPath("$.statusCode").value(401))
                .andExpect(MockMvcResultMatchers.jsonPath("$.message").value("로그인에 실패했습니다."))
                .andExpect(MockMvcResultMatchers.jsonPath("$.data").isEmpty())
                .andDo(print());
    }

    @Test
    @DisplayName("JWT 검증 성공 테스트")
    void jwt_verification_success() throws Exception {
        // JWT 토큰을 모킹하여 특정 값을 반환하도록 설정
        String testToken = "valid-test-token";
        given(jwtTokenProvider.validateToken(testToken)).willReturn(true);
        given(jwtTokenProvider.getAuthentication(testToken)).willReturn(
                new UsernamePasswordAuthenticationToken(
                        "testId",
                        "testPassword",
                        List.of(new SimpleGrantedAuthority("ROLE_USER")) // 권한 추가
                )
        );

        // MockMvc를 통해 JWT가 포함된 요청 수행
        mockMvc.perform(MockMvcRequestBuilders.get("/api/test")
                        .header("Authorization", "Bearer " + testToken)  // JWT 토큰을 Authorization 헤더에 추가
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().string("test"))
                .andDo(MockMvcResultHandlers.print());

        // validateToken과 getAuthentication이 호출되었는지 검증
        verify(jwtTokenProvider, times(1)).validateToken(testToken);
        verify(jwtTokenProvider, times(1)).getAuthentication(testToken);
    }

    @Test
    @DisplayName("JWT 검증 실패 테스트")
    void jwt_verification_failure() throws Exception {
        // JWT 토큰을 직접 생성
        String fakeToken = "가짜 토큰";

        // JWT 검증 실패 모킹
        given(jwtTokenProvider.validateToken(anyString())).willReturn(false); // 실패 반환

        // MockMvc를 통해 JWT가 포함된 요청 수행
        mockMvc.perform(MockMvcRequestBuilders.get("/api/test")
                        .header("Authorization", "Bearer " + fakeToken)  // 가짜 JWT 토큰을 Authorization 헤더에 추가
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.status().isForbidden())  // 403 응답 예상
                .andDo(print());
    }
}
