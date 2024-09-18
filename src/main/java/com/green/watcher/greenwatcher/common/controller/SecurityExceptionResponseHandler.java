package com.green.watcher.greenwatcher.common.controller;

import com.green.watcher.greenwatcher.common.user.dto.UserApiResponse;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.security.SignatureException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;
import org.springframework.security.authentication.AuthenticationServiceException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class SecurityExceptionResponseHandler{
    @ExceptionHandler(SignatureException.class)
    public ResponseEntity<UserApiResponse> handleSignatureException() {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(UserApiResponse.fail(HttpStatus.UNAUTHORIZED.value(), "로그인에 실패했습니다."));
    }

    @ExceptionHandler(MalformedJwtException.class)
    public ResponseEntity<UserApiResponse> handleMalformedJwtException() {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(UserApiResponse.fail(HttpStatus.UNAUTHORIZED.value(), "올바르지 않은 토큰입니다."));
    }

    @ExceptionHandler(AuthenticationServiceException.class)
    public ResponseEntity<UserApiResponse> handleAuthenticationServiceException() {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(UserApiResponse.fail(HttpStatus.UNAUTHORIZED.value(), "올바르지 않은 토큰입니다."));
    }

    @ExceptionHandler(ExpiredJwtException.class)
    public ResponseEntity<UserApiResponse> handleExpiredJwtException() {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(UserApiResponse.fail(HttpStatus.UNAUTHORIZED.value(), "토큰이 만료되었습니다."));
    }

}