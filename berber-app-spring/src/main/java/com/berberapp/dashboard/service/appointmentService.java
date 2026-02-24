package com.berberapp.dashboard.service;

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

    public List<appointmentModel> getPendingAppointments(String barberId) {
        return repository.findByBarberIdAndStatus(new ObjectId(barberId), "pending");
    }

    public appointmentModel updateAppointmentStatus(String appointmentId, String status) {
        appointmentModel appointment = repository.findById(appointmentId).orElseThrow(() -> new RuntimeException("Randevu Bulunamadı"));

        appointmentModel newAppointment = appointment.withStatus(status);

        return repository.save(newAppointment);
    }
 }
