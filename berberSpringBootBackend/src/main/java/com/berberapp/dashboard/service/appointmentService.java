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

    // Günlük geliri hesaplamak için appointmentların priceını dön
    public int getAllPrice(String barberId, String status, String fullDate) {
        List<appointmentModel> appointments = repository.findByBarberIdAndStatusAndFullDate(new ObjectId(barberId), status, fullDate);

        int totalAmount = 0;

        for (appointmentModel appointmentList : appointments) {
            totalAmount = totalAmount + appointmentList.totalPrice();
        }

        return totalAmount;
    }

    public List<appointmentModel> getDailyAppointments(ObjectId barberId, String fullDate) {
        return repository.findByBarberIdAndFullDate(barberId, fullDate);
    }
}