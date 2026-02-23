package com.berberapp.dashboard.repository;

import com.berberapp.dashboard.model.berber_model;
import org.springframework.data.mongodb.repository.MongoRepository;


public interface berber_repository extends MongoRepository<berber_model, String> {

}

