package com.berberapp.dashboard.controller;

import com.berberapp.dashboard.model.BarberUserModel;
import com.berberapp.dashboard.service.BarberUserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api")
public class BarberUserController {
    private final BarberUserService service;

    public BarberUserController(BarberUserService service) {
        this.service = service;
    }

    @PostMapping("/signup")
    public ResponseEntity<BarberUserModel> signup (@RequestBody BarberUserModel newUser) {
       Optional<BarberUserModel> isUserExist = service.isEmailExist(newUser.email());
       if (isUserExist.isEmpty()) {
           BarberUserModel savedUser = service.saveNewUser(newUser.name(), newUser.email(), newUser.password());
           return ResponseEntity.ok(savedUser);
       }

       return ResponseEntity.badRequest().build();
    }

    public record LoginRequest(String email, String password) {}
    public record LoginResponse(String name, String email) {}

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login (@RequestBody LoginRequest userInfo) {
        Optional <BarberUserModel> user = service.findUser(userInfo.email());
        // Gelen emaile kayıtlı kullanıcı yoksa
        if (user.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        // Şifreler eşleşmiyorsa
        if (!userInfo.password().equals(user.get().password()) ) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        return ResponseEntity.ok(new LoginResponse(user.get().name(), user.get().email()));

    }
}
