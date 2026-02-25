//Sadece isteği karşılar (Trafik polisi 👮‍♂️).
package com.berberapp.dashboard.controller;

import com.berberapp.dashboard.model.appointmentModel; // Dosya isminle aynı olmalı
import com.berberapp.dashboard.service.appointmentService;
import org.bson.types.ObjectId;
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

    // Test amaçlı ilerde silersin
    // GET /api/dashboard/appointments
    @GetMapping
    public ResponseEntity<List<appointmentModel>> getAllAppointments(){
        List<appointmentModel> appointments = service.getAllAppointments();

        if (appointments.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(appointments);
    }

    // Id si gönderilen berbere ait olan bütün randevular zaman farketmeksizin
    // GET /api/dashboard/appointments/barber/{barberId}
    @GetMapping("/barber/{barberId}")
    public ResponseEntity<List<appointmentModel>>  getByBarber(@PathVariable String barberId) {
        List<appointmentModel> appointments = service.getByBarber(barberId);

        if (appointments.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(appointments);
    }

    // Onay bekleyen randevular
    @GetMapping("/barber/{barberId}/pending")
    public ResponseEntity<List<appointmentModel>> getPendingAppointments(@PathVariable String barberId) {
        List<appointmentModel> activeAppointments = service.getPendingAppointments(barberId);

        if (activeAppointments.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(activeAppointments);
    }

    public static class helperClass {
        public String status;
    }

    // Randevu onaylama
    @PatchMapping("/{appointmentId}")
    public ResponseEntity<appointmentModel> updateAppointmentStatus(@PathVariable String appointmentId, @RequestBody helperClass box) {
        appointmentModel updatedAppointment = service.updateAppointmentStatus(appointmentId, box.status);

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
    public ResponseEntity<List<appointmentModel>> getDailyAppointments(@PathVariable String barberId, @RequestParam String fullDate) {
        List<appointmentModel> dailyAppointments = service.getDailyAppointments(new ObjectId(barberId), fullDate);

        if (dailyAppointments.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(dailyAppointments);
    }
}