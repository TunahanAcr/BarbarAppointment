package com.berberapp.dashboard.service;

import com.berberapp.dashboard.model.AppointmentModel;
import com.berberapp.dashboard.repository.appointmentRepository;
import org.bson.types.ObjectId;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class AppointmentService { // Burda class tanımladık çünkü kendi business logic imizi yazıyoruz
    private final appointmentRepository repository;

    public AppointmentService(appointmentRepository repository) {
        this.repository = repository;
    }

    public List<AppointmentModel> getAllAppointments() {
        return repository.findAll();
    }

    public List<AppointmentModel> getByBarber(String barberId) {
        return repository.findByBarberId(new ObjectId(barberId));
    }

    public List<AppointmentModel> getPendingAppointments(String barberId) {
        return repository.findByBarberIdAndStatus(new ObjectId(barberId), "pending");
    }

    public AppointmentModel updateAppointmentStatus(String appointmentId, String status, Boolean isActive) {
        AppointmentModel appointment = repository.findById(appointmentId).orElseThrow(() -> new RuntimeException("Randevu Bulunamadı"));

        AppointmentModel newAppointment = appointment.withStatusandisActive(status, isActive );

        return repository.save(newAppointment);
    }

    // Günlük geliri hesaplamak için appointmentların priceını dön
    public int getAllPrice(String barberId, String status, String fullDate) {
        List<AppointmentModel> appointments = repository.findByBarberIdAndStatusAndFullDate(new ObjectId(barberId), status, fullDate);

        return appointments.stream()
                .mapToInt(AppointmentModel::totalPrice) // Listeyi sadece fiyatlardan oluşan sayı listesine çevir
                .sum(); // Hepsini Topla
    }

    public List<AppointmentModel> getDailyAppointments(ObjectId barberId, String fullDate) {
        return repository.findByBarberIdAndFullDate(barberId, fullDate);
    }
}