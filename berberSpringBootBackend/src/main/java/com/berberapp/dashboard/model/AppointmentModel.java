package com.berberapp.dashboard.model;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;
import java.time.Instant;

@Document(collection = "appointments") // MongoDB Compass'taki isimle birebir aynı olmalı!
public record AppointmentModel(
        @Id /* _id alanını temsil ediyor*/ String id,
        ObjectId barberId,    // 'I' harfi büyük, Compass ile aynı
        String barberName,
        String date,
        String time,
        String fullDate,
        List<Service> services,
        Integer totalPrice, // DB'de Int32 görünüyor, Integer daha iyi olur
        String userName,
        ObjectId userId,      // DB'de ObjectId ama String olarak okunabilir
        java.time.Instant createdAt,
        String status,
        Boolean isActive
) {
    // Compact Constructor: Default değer atamak için kullanılır
    public AppointmentModel {
        if (status == null) {
            status = "pending";
        }

        if (isActive == null) {
            isActive = true ;
        }

        if (createdAt == null) {
            createdAt = Instant.now();
        }
    }

    // Bu metot, mevcut randevunun birebir aynısını alıp,
    // sadece status kısmına yeni değeri koyarak yepyeni bir kopya (record) üretir.
    public AppointmentModel withStatusandisActive(String newStatus, Boolean newisActive) {
        return new AppointmentModel(
                this.id(),
                this.barberId(),
                this.barberName(),
                this.date(),
                this.time(),
                this.fullDate(),
                this.services(),
                this.totalPrice(),
                this.userName(),
                this.userId(),
                this.createdAt(),
                newStatus, // burası değişiyor!
                newisActive // Burası değişiyor
        );
    }
}