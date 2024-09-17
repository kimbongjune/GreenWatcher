package com.green.watcher.greenwatcher.common.user.repository;

import com.green.watcher.greenwatcher.common.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

/**
 *  @author kim
 *  @since 2024.09.17
 *  @version 1.0.0
 *  사용자 JPA 레파지토리
 */
public interface UserRepository extends JpaRepository<User, String> {
    Optional<User> findById(String id);
}