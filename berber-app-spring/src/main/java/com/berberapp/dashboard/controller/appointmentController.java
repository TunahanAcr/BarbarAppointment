//Sadece isteği karşılar (Trafik polisi 👮‍♂️).
package com.berberapp.dashboard.controller;

import com.berberapp.dashboard.model.appointmentModel; // Dosya isminle aynı olmalı
import com.berberapp.dashboard.service.appointmentService;
import com.berberapp.dashboard.repository.appointmentRepository;
import jakarta.annotation.PostConstruct;
import org.bson.types.ObjectId;
import org.springframework.web.bind.annotation.*;
import java.util.List;


@RestController
@RequestMapping("/api/dashboard/appointments")
public class appointmentController {

    public final appointmentService service;

    public appointmentController(appointmentService service) {
        this.service = service;
    }

    @PostConstruct
    public void init() {
        System.out.println("### NEW AppointmentController LOADED ###");
    }

    // GET /api/dashboard/appointments
    @GetMapping
    public List<appointmentModel> getAllAppointments(){
        return service.getAllAppointments();
    }

    // GET /api/dashboard/appointments/barber/{barberId}
    @GetMapping("/barber/{barberId}")
    public List<appointmentModel> getByBarber(@PathVariable String barberId) {
        return service.getByBarber(barberId);
    }
}