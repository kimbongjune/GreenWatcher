package com.green.watcher.greenwatcher.common.user.repository;
import com.green.watcher.greenwatcher.common.user.entity.User;
import com.green.watcher.greenwatcher.common.user.enumerate.Role;
import com.green.watcher.greenwatcher.common.user.repository.UserRepository;
import com.green.watcher.greenwatcher.common.user.security.service.UserService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.test.annotation.Rollback;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
public class UserRepositoryTest {

    @Autowired
    private UserRepository userRepository;

    @Test
    @Transactional
    @Rollback
    @DisplayName("사용자를 저장하고 ID로 조회하는 테스트")
    public void testFindByIdSuccess() {
        // given
        User user = User.builder()
                .id("testuser")
                .nickname("testnickname")
                .email("testuser@example.com")
                .password("password")
                .role(Role.ROLE_USER)
                .build();

        // when
        userRepository.save(user);

        // then
        Optional<User> foundUser = userRepository.findById("testuser");
        assertThat(foundUser).isPresent();
        assertThat(foundUser.get().getNickname()).isEqualTo("testnickname");
    }

    @Test
    @Transactional
    @Rollback
    @DisplayName("존재하지 않는 ID로 조회시 Optional.empty() 반환")
    public void testFindByIdNotFound() {
        // when
        Optional<User> foundUser = userRepository.findById("nonexistent");

        // then
        assertThat(foundUser).isEmpty();
    }

    @Test
    @Rollback
    @DisplayName("유저 한 명 저장 시 성공")
    public void testSingleUserSave() {
        // given
        User user = User.builder()
                .id("testuser1")
                .nickname("testnickname1")
                .email("testuser1@example.com")
                .password("password")
                .role(Role.ROLE_USER)
                .build();

        // when
        User savedUser = userRepository.save(user);

        // then
        assertNotNull(savedUser);
        assertEquals("testuser1", savedUser.getId());
        assertEquals("testnickname1", savedUser.getNickname());
        assertEquals("testuser1@example.com", savedUser.getEmail());
    }
}
