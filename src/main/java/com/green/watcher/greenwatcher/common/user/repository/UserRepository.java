package com.green.watcher.greenwatcher.common.user.repository;

import com.green.watcher.greenwatcher.common.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, String> {
    Optional<User> findById(String id);
}