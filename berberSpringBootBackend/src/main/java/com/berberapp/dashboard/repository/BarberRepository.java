package com.berberapp.dashboard.repository;

import com.berberapp.dashboard.model.BarberModel;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;


public interface BarberRepository extends MongoRepository<BarberModel, String> {
    Optional<BarberModel> findByInviteCode(String inviteCode);

    boolean existsByInviteCode(String inviteCode);
}

