package com.berberapp.dashboard.service;

import com.berberapp.dashboard.controller.appointmentController;
import com.berberapp.dashboard.model.appointmentModel;
import com.berberapp.dashboard.repository.appointmentRepository;
import org.bson.types.ObjectId;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class appointmentService { // Burda class tanımladık çünkü kendi business logic imizi yazıyoruz
    private final appointmentRepository repository;

    public appointmentService(appointmentRepository repository) {
        this.repository = repository;
    }

    public List<appointmentModel> getAllAppointments() {
        return repository.findAll();
    }

    public List<appointmentModel> getByBarber(String barberId) {
        return repository.findByBarberId(new ObjectId(barberId));
    }
 }
