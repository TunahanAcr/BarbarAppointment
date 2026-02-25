// Veritabanı şemasını temsil eden record veya classlar.
package com.berberapp.dashboard.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import jakarta.validation.constraints.NotBlank;

@Document(collection = "barbers") // @Document Bu nesnenin MongoDB'deki hangi koleksiyona (tabloya) ait olduğunu söyler.
public record berber_model(
        @Id String id,

        @NotBlank String name,

        String location,
        Double rating,
        String image) {
}

