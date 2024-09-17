package com.green.watcher.greenwatcher.common.user.security.service;

import com.green.watcher.greenwatcher.common.dto.UserRegistrationDTO;
import com.green.watcher.greenwatcher.common.user.entity.User;
import com.green.watcher.greenwatcher.common.user.enumerate.Role;
import com.green.watcher.greenwatcher.common.user.repository.UserRepository;
import com.green.watcher.greenwatcher.common.user.security.details.CustomUserDetails;
import lombok.RequiredArgsConstructor;
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
import java.util.Optional;

@Service
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserService(@Lazy PasswordEncoder passwordEncoder, UserRepository userRepository){
        this.passwordEncoder = passwordEncoder;
        this.userRepository = userRepository;
    }

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

    public boolean registerUser(UserRegistrationDTO dto) {

        if(userRepository.existsById(dto.getId())){
            throw new DataIntegrityViolationException("이미 존재하는 유저입니다.");
        }

        User user = User.builder()
            .id(dto.getId())
            .nickname(dto.getNickname())
            .email(dto.getEmail())
            .password(passwordEncoder.encode(dto.getPassword())).build();
        User savedUser = userRepository.save(user);

        return savedUser.getId() != null;
    }
}