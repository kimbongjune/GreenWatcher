package com.green.watcher.greenwatcher.common.user.security.jwt;

import io.jsonwebtoken.MalformedJwtException;
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
        log.info("Request URI: {}", path);

        if ("/api/auth/login".equals(path) || "/api/auth/signup".equals(path)) {
            filterChain.doFilter(request, response);
            return;
        }

        try {
            String token = resolveToken(request);
            if (token == null || !jwtTokenProvider.validateToken(token)) {
                log.info("throw");
                throw new MalformedJwtException("검증되지 않은 토큰");
            }

            Authentication auth = jwtTokenProvider.getAuthentication(token);
            SecurityContextHolder.getContext().setAuthentication(auth);

        } catch (MalformedJwtException e) {
            // 예외 발생 시 필터 체인 중단
            log.info("catch");
            request.setAttribute("exception", e);
        }finally {
            filterChain.doFilter(request, response);
        }
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