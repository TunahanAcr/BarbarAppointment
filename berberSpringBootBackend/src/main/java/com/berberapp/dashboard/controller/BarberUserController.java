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

    public record SignupRequest(
            String name,
            String email,
            String password,
            String inviteCode // Kullanıcı berberId yi değil ona verdiğimiz inviteCode unu girecek
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
    public record LoginResponse(String name, String email, String berberId) {}

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login (@RequestBody LoginRequest userInfo) {
        Optional <BarberUserModel> user = barberUserService.findUser(userInfo.email());
        // Gelen emaile kayıtlı kullanıcı yoksa
        if (user.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        // Şifreler eşleşmiyorsa
        if (!userInfo.password().equals(user.get().password()) ) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        return ResponseEntity.ok(new LoginResponse(user.get().name(), user.get().email(), user.get().berberId()));

    }
}
