package com.green.watcher.greenwatcher.common.dto;

import com.green.watcher.greenwatcher.common.user.entity.User;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserRegistrationDTO {

    private String id;
    private String nickname;
    private String email;
    private String password;

    public User toEntity(){
        return User.builder()
                .id(this.id)
                .password(this.password)
                .nickname(this.nickname)
                .email(this.email).build();
    }
}
