package com.green.watcher.greenwatcher.common.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.security.servlet.PathRequest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.annotation.web.configurers.HeadersConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.rememberme.JdbcTokenRepositoryImpl;
import org.springframework.security.web.authentication.rememberme.PersistentTokenRepository;
import org.springframework.security.web.session.SimpleRedirectInvalidSessionStrategy;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import javax.sql.DataSource;
import java.util.Arrays;

/**
 *  @author kim
 *  @since 2024.09.16
 *  @version 1.0.0
 *  spring security bean 설정 클래스
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final DataSource dataSource;

    @Autowired
    public SecurityConfig(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    //security 필터
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            //csrf 비활성화
            .csrf(AbstractHttpConfigurer::disable)
            //iframe 허용(h2 console)
            .headers(headers -> headers.frameOptions(HeadersConfigurer.FrameOptionsConfig::sameOrigin))
            //필터 등록(예시)
            .authorizeHttpRequests(auth -> auth
                //admin URL은 ROLE_ADMIN 권한이 있는 사용자만
                .requestMatchers("/admin/**").hasRole("ADMIN")
                //user URL은 ROLE_USER 권한이 있는 사용자만
                .requestMatchers("/user/**").hasRole("USER")
                //h2 console 페이지는 모든 사용자에게 허용
                .requestMatchers(PathRequest.toH2Console()).permitAll()
                //임시로 모든 URL에 대해 모든 사용자에게 허용
                .anyRequest().permitAll()
            )
            //세션 관리 설정
            .sessionManagement(session -> session
                //세션 만료시 이동할 URL
                .invalidSessionStrategy(new SimpleRedirectInvalidSessionStrategy("/auth/login?error=true"))
                //최대 1개의 세션만 허용
                .maximumSessions(1)
                //true면 중복 로그인 시 새로운 세션을 허용하지 않음
                .maxSessionsPreventsLogin(false)
                //중복로그인으로 인해 만료시 이동할 URL
                .expiredUrl("/auth/login?error=true")
            )
            //로그인 관련 설정
            .formLogin(form -> form
                //로그인 페이지 URL
                .loginPage("/auth/login")
                //로그인 처리 URL(security가 알아서 처리함)
                .loginProcessingUrl("/auth/login")
                //로그인 폼의 사용자명 파라미터명
                .usernameParameter("id")
                //로그인 폼의 비밀번호 파라미터명
                .passwordParameter("password")
                //로그인 성공 시 리다이렉트 할 URL
                .defaultSuccessUrl("/map", true)
                //로그인 실패 시 리다이렉트 할 URL
                .failureUrl("/auth/login?error=true")
                //모든 사용자에게 허용
                .permitAll()
            )
            //로그아웃 관련 설정
            .logout(logout -> logout
                //로그아웃 처리 URL(security가 알아서 처리함)
                .logoutUrl("/auth/logout")
                //로그아웃 성공 시 리다이렉트 할 URL
                .logoutSuccessUrl("/auth/login?logout=true")
                //세션 무효화
                .invalidateHttpSession(true)
                //톰캣 쿠키 삭제
                .deleteCookies("JSESSIONID")
                //모든 사용자에게 허용
                .permitAll()
            )
            // 예외 처리 설정
            .exceptionHandling(exception -> exception
                // 잘못된 URL 요청 시 처리
                // 권한이 없을 때 처리
                .accessDeniedPage("/error/403")
                //잘못된 URL 처리
                .authenticationEntryPoint((request, response, authException) -> {
                    response.sendRedirect("/error/404");
                })
            )
            //자동 로그인 설정
            .rememberMe(rememberMe -> rememberMe
                    //remember-me 쿠키의 키 설정
                    .key("uniqueAndSecret")
                    //토큰의 유효 기간 (예: 2주)
                    .tokenValiditySeconds(14 * 24 * 60 * 60)
                    //사용자 정보를 저장하고, 불러올 레파지토리 지정
                    .tokenRepository(persistentTokenRepository())
            )
            //CORS 설정
            .cors(cors -> cors
                .configurationSource(corsConfigurationSource())  // CORS 설정 정의
            );

        return http.build();
    }

    /*
     *  자동로그인 토큰을 저장할 레파지토리 빈을 생성한다.
     *  spring security에서 관리한다.
     *  테이블명 : PERSISTENT_LOGINS
     *  컬럼 : USERNAME, SERIES, TOKEN, LAST_USED
     */
    @Bean
    public PersistentTokenRepository persistentTokenRepository() {
        JdbcTokenRepositoryImpl tokenRepository = new JdbcTokenRepositoryImpl();
        tokenRepository.setDataSource(dataSource);
        //기존 테이블 사용
        tokenRepository.setCreateTableOnStartup(false);
        return tokenRepository;
    }

    /*
     *  CORS 설정 빈을 생성한다.
     *  특정 URL에 대한 접근과 특정 메서드에 대한 접근만 허용한다.
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:5500"));  // 허용할 도메인
        configuration.setAllowedMethods(Arrays.asList("GET","POST", "PUT", "DELETE"));  // 허용할 HTTP 메서드
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    /*
     *  패스워드 암호화 빈을 생성한다.
     *  spring security에서 관리한다.
     *  회원가입, 로그인 시 사용한다.
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /*
     *  사용자 인증, 인가를 처리하는 빈을 생성한다.
     *  spring security에서 관리한다.
     */
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }
}