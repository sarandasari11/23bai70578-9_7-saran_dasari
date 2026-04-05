package com.example.experiment7;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.httpBasic;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
class RbacIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void publicEndpointShouldBeAccessibleWithoutAuth() throws Exception {
        mockMvc.perform(get("/api/public/hello"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("This is a public endpoint"));
    }

    @Test
    void userEndpointShouldReturnUnauthorizedWithoutAuth() throws Exception {
        mockMvc.perform(get("/api/user/profile"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.status").value(401));
    }

    @Test
    void userShouldAccessUserEndpointSuccessfully() throws Exception {
        mockMvc.perform(get("/api/user/profile").with(httpBasic("user1", "user123")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Welcome, authenticated user"));
    }

    @Test
    void userShouldBeForbiddenFromAdminEndpoint() throws Exception {
        mockMvc.perform(get("/api/admin/dashboard").with(httpBasic("user1", "user123")))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.status").value(403));
    }

    @Test
    void adminShouldAccessAdminEndpointSuccessfully() throws Exception {
        mockMvc.perform(get("/api/admin/dashboard").with(httpBasic("admin1", "admin123")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Welcome, admin"));
    }

    @Test
    void loginEndpointShouldAuthenticateValidCredentials() throws Exception {
        String body = "{\"username\":\"user1\",\"password\":\"user123\"}";

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Login successful"))
                .andExpect(jsonPath("$.role").value("ROLE_USER"));
    }
}
