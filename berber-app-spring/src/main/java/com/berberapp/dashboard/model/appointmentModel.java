package com.berberapp.dashboard.model;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;
import java.time.Instant;


@Document(collection = "appointments") // MongoDB Compass'taki isimle birebir aynı olmalı!
public record appointmentModel(
        @Id /* _id alanını temsil ediyor*/ String id,
        ObjectId barberId,    // 'I' harfi büyük, Compass ile aynı
        String barberName,
        String date,
        String time,
        String fullDate,
        List<String> services,
        Integer totalPrice, // DB'de Int32 görünüyor, Integer daha iyi olur
        String userName,
        ObjectId userId,      // DB'de ObjectId ama String olarak okunabilir
        java.time.Instant createdAt,
        String status
) {
    // Compact Constructor: Default değer atamak için kullanılır
    public appointmentModel {
        if (status == null) {
            status = "active";
        }
        if (createdAt == null) {
            createdAt = Instant.now();
        }
    }

}