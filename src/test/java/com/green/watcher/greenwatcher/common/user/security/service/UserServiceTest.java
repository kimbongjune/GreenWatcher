package com.green.watcher.greenwatcher.common.user.security.service;

import com.green.watcher.greenwatcher.common.user.dto.UserRegistrationDTO;
import com.green.watcher.greenwatcher.common.user.entity.User;
import com.green.watcher.greenwatcher.common.user.enumerate.Role;
import com.green.watcher.greenwatcher.common.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    private UserService userService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        userService = new UserService(passwordEncoder, userRepository);
    }

    @Test
    @DisplayName("사용자 정보 로드")
    void testLoadUserByUsername_Success() {
        // given
        String id = "user1";
        User user = User.builder()
                .id(id)
                .password("encodedPass")
                .role(Role.ROLE_USER)
                .build();
        when(userRepository.findById(id)).thenReturn(Optional.of(user));

        // when
        UserDetails userDetails = userService.loadUserByUsername(id);

        // then
        assertNotNull(userDetails);
        assertEquals(id, userDetails.getUsername());
    }

    @Test
    @DisplayName("회원가입 테스트")
    void testRegisterUser_Success() {
        // given
        UserRegistrationDTO dto = new UserRegistrationDTO();
        dto.setId("user1");
        dto.setPassword("password");

        User user = dto.toEntity();
        when(userRepository.existsById(dto.getId())).thenReturn(false);
        when(passwordEncoder.encode(dto.getPassword())).thenReturn("encodedPass");
        when(userRepository.save(any(User.class))).thenReturn(user);

        // when
        boolean result = userService.registerUser(dto);

        // then
        assertTrue(result);
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    @DisplayName("중복 회원가입 테스트")
    void testRegisterUser_AlreadyExists() {
        // given
        UserRegistrationDTO dto = new UserRegistrationDTO();
        dto.setId("user1");
        dto.setPassword("password");

        when(userRepository.existsById(dto.getId())).thenReturn(true);

        // when & then
        assertThrows(DataIntegrityViolationException.class, () -> {
            userService.registerUser(dto);
        });
    }
    
}