package com.berberapp.dashboard.repository;

import com.berberapp.dashboard.model.berber_model;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;


public interface BarberRepository extends MongoRepository<berber_model, String> {
    Optional<berber_model> findByInviteCode(String inviteCode);
}

