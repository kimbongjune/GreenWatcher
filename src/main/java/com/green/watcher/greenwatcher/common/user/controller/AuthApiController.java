package com.green.watcher.greenwatcher.common.user.controller;

import com.green.watcher.greenwatcher.common.user.dto.UserApiResponse;
import com.green.watcher.greenwatcher.common.user.dto.UserRegistrationDTO;
import com.green.watcher.greenwatcher.common.user.entity.User;
import com.green.watcher.greenwatcher.common.user.enumerate.Role;
import com.green.watcher.greenwatcher.common.user.repository.UserRepository;
import com.green.watcher.greenwatcher.common.user.security.jwt.JwtTokenProvider;
import com.green.watcher.greenwatcher.common.user.security.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 *  @author kim
 *  @since 2024.09.18
 *  @version 1.0.0
 *  api 로그인 컨트롤러
 *  swagger를 이용한 api 문서 자동화
 */
@RestController
@RequestMapping("/api/auth")
@Slf4j
@Tag(name = "인증 API", description = "로그인 및 회원가입 관련 API")
public class AuthApiController {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserService userService;
    private final PasswordEncoder passwordEncoder;

    public AuthApiController(AuthenticationManager authenticationManager,
                          JwtTokenProvider jwtTokenProvider,
                             UserService userService,
                          PasswordEncoder passwordEncoder) {
        this.authenticationManager = authenticationManager;
        this.jwtTokenProvider = jwtTokenProvider;
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
    }

    // 로그인 엔드포인트
    @Operation(summary = "로그인", description = "사용자가 로그인하여 JWT 토큰을 발급받습니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "로그인 성공",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = UserApiResponse.class),
                            examples = @ExampleObject(value = "{\"statusCode\": 200, \"message\": \"성공\", \"data\": \"jwt_token\"}"))),
            @ApiResponse(responseCode = "401", description = "로그인 실패",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = UserApiResponse.class),
                            examples = @ExampleObject(value = "{\"statusCode\": 401, \"message\": \"로그인에 실패했습니다.\", \"data\": null}")))
    })
    @PostMapping("/login")
    public ResponseEntity<UserApiResponse<String>> login(
            @RequestBody @Schema(description = "로그인 요청 DTO", example = "{\"id\": \"user123\", \"password\": \"password\"}")
            UserRegistrationDTO loginRequest) {
        try {
            UsernamePasswordAuthenticationToken authenticationToken =
                    new UsernamePasswordAuthenticationToken(loginRequest.getId(), loginRequest.getPassword());
            Authentication authentication = authenticationManager.authenticate(authenticationToken);

            // 로그인 성공 시 JWT 토큰 발급
            String token = jwtTokenProvider.createToken(loginRequest.getId(), authentication);
            return ResponseEntity.ok(UserApiResponse.success(token));

        } catch (AuthenticationException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(UserApiResponse.fail(HttpStatus.UNAUTHORIZED.value(), "로그인에 실패했습니다."));
        }
    }

    @Operation(summary = "회원가입", description = "새로운 사용자를 등록합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "회원가입 성공",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = UserApiResponse.class),
                            examples = @ExampleObject(value = "{\"statusCode\": 200, \"message\": \"성공\", \"data\": \"회원가입이 완료되었습니다.\"}"))),
            @ApiResponse(responseCode = "409", description = "회원가입 실패 (중복된 사용자)",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = UserApiResponse.class),
                            examples = @ExampleObject(value = "{\"statusCode\": 409, \"message\": \"회원가입에 실패했습니다: Duplicate entry\", \"data\": null}")))
    })
    @PostMapping("/signup")
    public ResponseEntity<UserApiResponse<String>> signup(
            @RequestBody @Schema(description = "회원가입 요청 DTO", example = "{\"id\": \"user123\", \"nickname\": \"닉네임\", \"email\": \"user@example.com\", \"password\": \"password\"}")
            UserRegistrationDTO signUpRequest) {
        try {
            userService.registerUser(signUpRequest);
            return ResponseEntity.ok(UserApiResponse.success("회원가입이 완료되었습니다."));
        } catch (DataIntegrityViolationException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(UserApiResponse.fail(HttpStatus.CONFLICT.value(), "회원가입에 실패했습니다"));
        }
    }
}