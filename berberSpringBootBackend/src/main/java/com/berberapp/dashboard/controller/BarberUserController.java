package com.berberapp.dashboard.controller;

import com.berberapp.dashboard.model.BarberUserModel;
import com.berberapp.dashboard.service.BarberUserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/signup")
public class BarberUserController {
    private final BarberUserService service;

    public BarberUserController(BarberUserService service) {
        this.service = service;
    }

    @PostMapping()
    public ResponseEntity<BarberUserModel> signup (@RequestBody BarberUserModel newUser) {
       Optional<BarberUserModel> isUserExist = service.isEmailExist(newUser.email());
       if (isUserExist.isEmpty()) {
           BarberUserModel savedUser = service.saveNewUser(newUser.name(), newUser.email(), newUser.password());
           return ResponseEntity.ok(savedUser);
       }

       return ResponseEntity.badRequest().build();

    }

}
