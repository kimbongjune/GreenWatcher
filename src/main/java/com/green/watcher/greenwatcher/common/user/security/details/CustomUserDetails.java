package com.green.watcher.greenwatcher.common.user.security.details;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;

/**
 *  @author kim
 *  @since 2024.09.17
 *  @version 1.0.0
 *  @See UserService
 *  사용자 계정정보를 security에서 관리하기 위한 커스텀 userDetails
 */
public class CustomUserDetails implements UserDetails {

    private String id;
    private String nickname;
    private String email;
    private String password;
    private Collection<? extends GrantedAuthority> authorities;

    /*
     *  회원정보 저장 생성자
     *  UserService에서 시큐리티 콘텍스트 객체에 넘길 때 사용
     */
    public CustomUserDetails(String id, String nickname, String email, String password, Collection<? extends GrantedAuthority> authorities) {
        this.id = id;
        this.nickname = nickname;
        this.email = email;
        this.password = password;
        this.authorities = authorities;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return id; // 여기서는 닉네임을 반환
    }

    public String getEmail() {
        return email;
    }

    public String getId() {
        return id;
    }

    public String getNickname(){
        return nickname;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}