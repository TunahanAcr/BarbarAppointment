//Sadece isteği karşılar (Trafik polisi 👮‍♂️).
package com.berberapp.dashboard.controller;

import com.berberapp.dashboard.model.appointmentModel; // Dosya isminle aynı olmalı
import com.berberapp.dashboard.service.appointmentService;
import jakarta.annotation.PostConstruct;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;


@RestController
@RequestMapping("/api/dashboard/appointments")
public class appointmentController {

    public final appointmentService service;

    public appointmentController(appointmentService service) {
        this.service = service;
    }

    // GET /api/dashboard/appointments
    @GetMapping
    public ResponseEntity<List<appointmentModel>> getAllAppointments(){
        List<appointmentModel> appointments = service.getAllAppointments();

        if (appointments.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(appointments);
    }

    // GET /api/dashboard/appointments/barber/{barberId}
    @GetMapping("/barber/{barberId}")
    public ResponseEntity<List<appointmentModel>>  getByBarber(@PathVariable String barberId) {
        List<appointmentModel> appointments = service.getByBarber(barberId);

        if (appointments.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(appointments);
    }

    @GetMapping("/barber/{barberId}/pending")
    public ResponseEntity<List<appointmentModel>> getPendingAppointments(@PathVariable String barberId) {
        List<appointmentModel> activeAppointments = service.getPendingAppointments(barberId);

        if (activeAppointments.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(activeAppointments);
    }

    public static class StatusUpdateRequest {
        public String status;
    }

    @PatchMapping("/{appointmentId}")
    public ResponseEntity<appointmentModel> updateAppointmentStatus(@PathVariable String appointmentId, @RequestBody StatusUpdateRequest kuryeKutusu) {
        appointmentModel updatedAppointment = service.updateAppointmentStatus(appointmentId, kuryeKutusu.status);

        return ResponseEntity.ok(updatedAppointment);
        }
    }