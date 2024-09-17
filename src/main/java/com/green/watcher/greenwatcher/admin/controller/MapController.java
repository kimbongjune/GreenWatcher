package com.green.watcher.greenwatcher.admin.controller;

import com.green.watcher.greenwatcher.common.user.security.details.CustomUserDetails;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 *  @author kim
 *  @since 2024.09.16
 *  @version 1.0.0
 *  지도 화면을 보여주는 컨트롤러
 */
@Controller
@RequestMapping("/map")
@Slf4j
public class MapController {

    @GetMapping("")
    public String mapPage(@AuthenticationPrincipal CustomUserDetails userDetails){
        if(userDetails != null){
            log.info("login user: {}", userDetails.getUsername());
        }
        return "admin/map";
    }
}
