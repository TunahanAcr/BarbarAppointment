package com.berberapp.dashboard.controller;

import com.berberapp.dashboard.model.BarberUserModel;
import com.berberapp.dashboard.repository.BarberUserRepository;
import com.berberapp.dashboard.service.BarberUserService;
import com.berberapp.dashboard.repository.BarberRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api")
public class BarberUserController {
    private final BarberUserService barberUserService;
    private final BarberUserRepository barberUserRepository;
    private final BarberRepository berber_repository;

    public BarberUserController(BarberUserService barberUserService, BarberUserRepository barberUserRepository, BarberRepository berber_repository) {
        this.barberUserService = barberUserService;
        this.barberUserRepository = barberUserRepository;
        this.berber_repository = berber_repository;
    }

    // SignUp isteği için DTO
    public record SignupRequest(
            String name,
            String email,
            String password,
            String inviteCode, // Kullanıcı berberId yi değil ona verdiğimiz inviteCode unu girecek
            String role
    ) {}

    @PostMapping("/signup")
    public ResponseEntity<?> signup (@RequestBody SignupRequest request) {
        try {
            BarberUserModel newUser = barberUserService.registerUserWithInviteCode(request) ;
            return ResponseEntity.ok(newUser);
        }
        catch (RuntimeException e) {
            return  ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    public record LoginRequest(String email, String password) {}

    @PostMapping("/login")
    public ResponseEntity<?> login (@RequestBody LoginRequest userInfo) {
        try {
            String generatedToken = barberUserService.loginUser(userInfo.email(), userInfo.password());
            return ResponseEntity.ok(generatedToken);
        }
        catch (RuntimeException e) {
            return  ResponseEntity.badRequest().body(e.getMessage());
        }

    }
}
