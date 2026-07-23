package com.berberapp.dashboard.controller;

import com.berberapp.dashboard.model.BarberModel;
import com.berberapp.dashboard.service.BarberService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/barbers")
public class BarberController {

    private final BarberService barberService;

    BarberController(BarberService barberService) {
        this.barberService = barberService;
    }

    public record CreateBarberRequest(
            @NotBlank String name,
            String location,
            String image
    ) {}

    @PostMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<?> addBarber(@RequestBody @Valid CreateBarberRequest request) {

        BarberModel savedBarber = barberService.createBarber(request);

        return ResponseEntity.status(HttpStatus.CREATED).body(savedBarber);
    }

}
