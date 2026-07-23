package com.berberapp.dashboard.service;

import com.berberapp.dashboard.controller.BarberController;
import com.berberapp.dashboard.model.BarberModel;
import com.berberapp.dashboard.repository.BarberRepository;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class BarberService {
    private final BarberRepository barberRepository;

    public BarberService(BarberRepository barberRepository) {
        this.barberRepository = barberRepository;
    }

    public BarberModel createBarber(BarberController.CreateBarberRequest request) {

        String generatedInviteCode = generateUniqueInviteCode();

        BarberModel newBarber = new BarberModel(
                null, // Bunu mongo kendisi vercek
                request.name(), // Admin gönderiyor
                request.location(), // Admin gönderiyor
                5.0,
                request.image(), // Admin gönderiyor
                generatedInviteCode, // Methodumuz oluşturuyor
                false // başlangıçta sahiplenilmedi
        );

        return barberRepository.save(newBarber);
    }

    private String generateUniqueInviteCode() {
        String code;
        do {
            code = "BRB-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase();
        } while (barberRepository.existsByInviteCode(code));

        return code;
    }
}
