package com.green.watcher.greenwatcher.admin.controller;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class MapControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    @DisplayName("map view 테스트")
    public void testMapPage() throws Exception {
        mockMvc.perform(get("/map"))
                .andExpect(status().isOk()) // HTTP 200
                .andExpect(view().name("admin/map")) //admin/map.html
                .andExpect(content().contentType("text/html;charset=UTF-8")); //html
    }
}
