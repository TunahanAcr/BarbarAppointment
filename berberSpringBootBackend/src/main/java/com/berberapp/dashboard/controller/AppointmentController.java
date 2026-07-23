//Sadece isteği karşılar (Trafik polisi 👮‍♂️).
package com.berberapp.dashboard.controller;

import com.berberapp.dashboard.model.AppointmentModel; // Dosya isminle aynı olmalı
import com.berberapp.dashboard.service.AppointmentService;
import org.bson.types.ObjectId;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;


@RestController
@RequestMapping("/api/dashboard/appointments")
public class AppointmentController {

    public final AppointmentService service;

    public AppointmentController(AppointmentService service) {
        this.service = service;
    }

    // Test amaçlı ilerde silersin
    // GET /api/dashboard/appointments
    @GetMapping
    public ResponseEntity<List<AppointmentModel>> getAllAppointments(){
        List<AppointmentModel> appointments = service.getAllAppointments();

        if (appointments.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(appointments);
    }

    // Id si gönderilen berbere ait olan bütün randevular zaman farketmeksizin
    // GET /api/dashboard/appointments/barber/{barberId}
    @GetMapping("/barber/{barberId}")
    public ResponseEntity<List<AppointmentModel>>  getByBarber(@PathVariable String barberId) {
        List<AppointmentModel> appointments = service.getByBarber(barberId);

        if (appointments.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(appointments);
    }

    // Onay bekleyen randevular
    @GetMapping("/barber/{barberId}/pending")
    public ResponseEntity<List<AppointmentModel>> getPendingAppointments(@PathVariable String barberId) {
        List<AppointmentModel> activeAppointments = service.getPendingAppointments(barberId);

        if (activeAppointments.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(activeAppointments);
    }

    public static class helperClass {
        public String status;
        public Boolean isActive;
    }

    // Randevu onaylama/reddetme
    @PatchMapping("/{appointmentId}")
    public ResponseEntity<AppointmentModel> updateAppointmentStatus(@PathVariable String appointmentId, @RequestBody helperClass box) {
        AppointmentModel updatedAppointment = service.updateAppointmentStatus(appointmentId, box.status, box.isActive);

        return ResponseEntity.ok(updatedAppointment);
        }

    public static class PriceRequest {

    }

    // O günkü kazanılan miktar ve kazanılması beklenen miktar
    @GetMapping("/barber/{barberId}/price")
    public  ResponseEntity<Integer> getPrices(@PathVariable String barberId, @RequestParam String status, @RequestParam String fullDate) {
        int price = service.getAllPrice(barberId, status, fullDate );

        return ResponseEntity.ok(price);
    }

    @GetMapping("/barber/{barberId}/daily")
    public ResponseEntity<List<AppointmentModel>> getDailyAppointments(@PathVariable String barberId, @RequestParam String fullDate) {
        List<AppointmentModel> dailyAppointments = service.getDailyAppointments(new ObjectId(barberId), fullDate);

        if (dailyAppointments.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(dailyAppointments);
    }
}