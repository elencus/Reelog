package org.reelog.controller;

import jakarta.validation.Valid;
import org.reelog.dto.LoginRequest;
import org.reelog.dto.RegisterRequest;
import org.reelog.service.AuthService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public Map<String, String> register(@Valid @RequestBody RegisterRequest request){
        var user = authService.register(request);
        return Map.of(
                "message", "Account created",
                "username", user.getUsername()
        );
    }

    @PostMapping("/login")
    public Map<String, String> login(@Valid @RequestBody LoginRequest request){
        String token = authService.login(request);
        return Map.of("token", token);
    }
}
