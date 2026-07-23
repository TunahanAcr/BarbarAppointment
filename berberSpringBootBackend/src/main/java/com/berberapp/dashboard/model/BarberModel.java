// Veritabanı şemasını temsil eden record veya classlar.
package com.berberapp.dashboard.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import jakarta.validation.constraints.NotBlank;

@Document(collection = "barbers") // @Document Bu nesnenin MongoDB'deki hangi koleksiyona (tabloya) ait olduğunu söyler.
public record BarberModel(
        @Id String id,

        @NotBlank String name,

        String location,
        Double rating,
        String image,
        String inviteCode, // Bu invite code ile userlar ile dükkanlarını eşleyeceğim
        boolean claimed // Bu berber daha önceden bir userla eşleşmiş mi kontrolü
) {
}

