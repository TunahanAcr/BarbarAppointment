package com.berberapp.dashboard.repository;

import com.berberapp.dashboard.model.BarberUserModel;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface BarberUserRepository extends MongoRepository<BarberUserModel, String> { // Burdaki string parametresi MongoRepo ya @Id notasyonlu değişkenin tipini belirtmek için var
    Optional<BarberUserModel> findByEmail(String email);
}
