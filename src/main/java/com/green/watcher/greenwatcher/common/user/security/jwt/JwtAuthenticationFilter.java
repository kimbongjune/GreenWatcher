package com.green.watcher.greenwatcher.common.user.security.jwt;

import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.security.core.Authentication;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;

/**
 *  @author kim
 *  @since 2024.09.18
 *  @version 1.0.0
 *  JWT 인증 필터
 *  회원가입, 로그인은 필터를 거치지 않는다.
 */
@Slf4j
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenProvider jwtTokenProvider;

    // JwtTokenProvider 주입
    public JwtAuthenticationFilter(JwtTokenProvider jwtTokenProvider) {
        this.jwtTokenProvider = jwtTokenProvider;
    }

    //http 요청 필터
    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        String path = request.getRequestURI();
        log.debug("Request URI: {}", path);

        if ("/api/auth/login".equals(path) || "/api/auth/signup".equals(path)) {
            filterChain.doFilter(request, response);
            return;
        }

        // 헤더에서 JWT를 받아옵니다.
        String token = resolveToken(request);
        log.debug("JWT Token: {}", token);

        // 토큰의 유효성 검사
        if (token != null && jwtTokenProvider.validateToken(token)) {
            log.debug("JWT Token is valid");
            // 토큰이 유효하면 인증 정보를 받아와 SecurityContext에 저장
            Authentication authentication = jwtTokenProvider.getAuthentication(token);
            SecurityContextHolder.getContext().setAuthentication(authentication);
        }else {
            log.debug("Invalid or missing JWT Token");
            // 토큰이 없거나 유효하지 않으면 403 Forbidden 반환
            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
            response.getWriter().write("검증되지 않은 토큰");
            return;
        }

        filterChain.doFilter(request, response);
    }

    //토큰 검증
    private String resolveToken(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}