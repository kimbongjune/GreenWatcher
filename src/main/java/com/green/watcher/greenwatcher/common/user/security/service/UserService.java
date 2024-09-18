package com.green.watcher.greenwatcher.common.user.security.service;

import com.green.watcher.greenwatcher.common.user.dto.UserRegistrationDTO;
import com.green.watcher.greenwatcher.common.user.entity.User;
import com.green.watcher.greenwatcher.common.user.repository.UserRepository;
import com.green.watcher.greenwatcher.common.user.security.details.CustomUserDetails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collections;

/**
 *  @author kim
 *  @since 2024.09.17
 *  @version 1.0.0
 *  사용자 인증 인가처리를 하는 service 클래스
 */
@Service
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    /*
     *  UserService 생성자
     *  PasswordEncoder 빈의 순환참조를 방지하기 위해 Lazy 어노테이션 사용
     */
    @Autowired
    public UserService(@Lazy PasswordEncoder passwordEncoder, UserRepository userRepository){
        this.passwordEncoder = passwordEncoder;
        this.userRepository = userRepository;
    }

    /*
     *  시큐리티 콘텍스트에 전달할 유저 정보 객체
     *  별도의 CustomUserDetails클래스를 생성하여 사용
     */
    @Override
    public UserDetails loadUserByUsername(String id) throws UsernameNotFoundException {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UsernameNotFoundException("로그인정보를 확인해주세요: " + id));

        return new CustomUserDetails(
                user.getId(),
                user.getNickname(),
                user.getEmail(),
                user.getPassword(),
                Collections.singleton(new SimpleGrantedAuthority(user.getRole().name()))
        );
    }

    /*
     *  회원가입 메서드
     */
    public boolean registerUser(UserRegistrationDTO dto) {

        if(userRepository.existsById(dto.getId())){
            throw new DataIntegrityViolationException("이미 존재하는 유저입니다.");
        }

        User user = dto.toEntity();
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        User savedUser = userRepository.save(user);

        return savedUser.getId() != null;
    }
}