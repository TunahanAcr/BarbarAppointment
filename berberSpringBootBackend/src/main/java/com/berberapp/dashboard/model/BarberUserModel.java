package com.berberapp.dashboard.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "barberUsers")
public record BarberUserModel(
        @Id String id,
        String name,
        String email,
        String password,
        java.time.Instant createdAt
) {


}
