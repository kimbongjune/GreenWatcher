package com.green.watcher.greenwatcher.common.user.security.jwt;

import com.green.watcher.greenwatcher.common.user.security.service.UserService;
import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;
import java.util.stream.Collectors;
import java.util.Collection;
import org.springframework.security.core.GrantedAuthority;

/**
 *  @author kim
 *  @since 2024.09.18
 *  @version 1.0.0
 *  jwt 토큰 관련 유틸 클래스
 *  토큰을 생성하고 관리한다.
 */
@Component
public class JwtTokenProvider {

    private Key key;

    // 토큰 유효 시간 (예: 1시간)
    private long tokenValidTime = 60 * 60 * 1000L;

    private final UserService userService;

    public JwtTokenProvider(UserService userService, @Value("${jwt.secret}") String secretKey) {
        this.userService = userService;
        // secretKey를 Base64로 디코딩하여 HS256에 적합한 키 생성
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        this.key = Keys.hmacShaKeyFor(keyBytes);
    }

    // JWT 토큰 생성
    public String createToken(String username, Authentication authentication) {
        Claims claims = Jwts.claims().setSubject(username);
        claims.put("roles", authentication.getAuthorities().stream()
                .map(authority -> authority.getAuthority())
                .collect(Collectors.toList()));
        Date now = new Date();
        Date validity = new Date(now.getTime() + tokenValidTime);

        return Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(now)
                .setExpiration(validity)
                .signWith(key, SignatureAlgorithm.HS256)  // HS256에 적합한 키 사용
                .compact();
    }

    // 토큰에서 인증 정보 조회
    public Authentication getAuthentication(String token) {
        String username = getUsername(token);
        UserDetails userDetails = userService.loadUserByUsername(username);
        return new UsernamePasswordAuthenticationToken(userDetails, "", userDetails.getAuthorities());
    }

    // 토큰에서 회원 정보 추출
    public String getUsername(String token) {
        return Jwts.parserBuilder().setSigningKey(key)
                .build()
                .parseClaimsJws(token).getBody().getSubject();
    }

    // 토큰의 유효성 + 만료일자 확인
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(key)
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (ExpiredJwtException e) {
            // 토큰 만료
            return false;
        } catch (JwtException | IllegalArgumentException e) {
            // 유효하지 않은 토큰
            return false;
        }
    }
}