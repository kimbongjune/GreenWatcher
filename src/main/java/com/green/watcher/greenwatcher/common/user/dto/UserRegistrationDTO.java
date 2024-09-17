package com.green.watcher.greenwatcher.common.user.dto;

import com.green.watcher.greenwatcher.common.user.entity.User;
import lombok.*;

/**
 *  @author kim
 *  @since 2024.09.17
 *  @version 1.0.0
 *  인증 인가 컨트롤러 요청 객체
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserRegistrationDTO {

    private String id;
    private String nickname;
    private String email;
    private String password;

    /*
     *  dto -> entity 변환 메서드
     *  각 레이어의 독립성을 위해 사용한다.
     */
    public User toEntity(){
        return User.builder()
            .id(this.id)
            .password(this.password)
            .nickname(this.nickname)
            .email(this.email).build();
    }
}
