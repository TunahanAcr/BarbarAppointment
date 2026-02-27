package com.berberapp.dashboard.service;

import com.berberapp.dashboard.model.BarberUserModel;
import com.berberapp.dashboard.repository.BarberUserRepository;
import org.springframework.data.annotation.Id;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class BarberUserService {
    private final BarberUserRepository repository;

    public BarberUserService(BarberUserRepository repository) {
        this.repository = repository;
    }

    public Optional<BarberUserModel> isEmailExist(String email) {
        return repository.findByEmail(email);
        }
    public BarberUserModel saveNewUser(String name, String email, String password) {
        BarberUserModel newUser = new BarberUserModel(null ,name, email, password, java.time.Instant.now());
        return repository.save(newUser);
    }
    }

