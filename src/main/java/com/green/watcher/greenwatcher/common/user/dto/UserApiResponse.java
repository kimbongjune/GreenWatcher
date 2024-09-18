package com.green.watcher.greenwatcher.common.user.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

/**
 *  @author kim
 *  @since 2024.09.18
 *  @version 1.0.0
 *  api 로그인 응답 객체
 */
@Getter
@Setter
@AllArgsConstructor
public class UserApiResponse<T> {
    private int statusCode;
    private String message;
    private T data;

    public static <T> UserApiResponse<T> success(T data) {
        return new UserApiResponse<>(200, "성공", data);
    }

    public static <T> UserApiResponse<T> fail(int statusCode, String message) {
        return new UserApiResponse<>(statusCode, message, null);
    }
}