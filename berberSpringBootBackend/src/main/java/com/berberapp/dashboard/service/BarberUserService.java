package com.berberapp.dashboard.service;

import com.berberapp.dashboard.controller.BarberUserController;
import com.berberapp.dashboard.model.BarberUserModel;
import com.berberapp.dashboard.model.berber_model;
import com.berberapp.dashboard.repository.BarberUserRepository;
import com.berberapp.dashboard.repository.BarberRepository;
import org.springframework.stereotype.Service;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import com.berberapp.dashboard.service.JwtService;

import java.util.Optional;

@Service
public class BarberUserService {

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    private final BarberUserRepository barberUserRepository;
    private final BarberRepository barberRepository;
    private final JwtService jwtService;

    public BarberUserService(BarberUserRepository barberUserRepository, BarberRepository barberRepository, JwtService jwtService) {
        this.barberUserRepository = barberUserRepository;
        this.barberRepository = barberRepository;
        this.jwtService = jwtService;
    }

        public BarberUserModel saveNewUser(String name, String email, String password, String berberId) {

        String hashedPassword = passwordEncoder.encode(password);

        BarberUserModel newUser = new BarberUserModel(null ,name, email, hashedPassword, berberId, java.time.Instant.now());

        return barberUserRepository.save(newUser);
    }


    public BarberUserModel registerUserWithInviteCode (BarberUserController.SignupRequest request) {
        // Email zaten var mı kontrolü
        if (barberUserRepository.findByEmail(request.email()).isPresent()) {
            throw new RuntimeException("Bu email zaten kullanımda"); // Buralarda method bizden bir barbaruser modeli beklediği için hata çıkarsa throw fırlatıyoruz ki uygulama çökmesin
        }

        // Kullanıcının girdiği inviteCode ile dükkanı bul
        berber_model barber = barberRepository.findByInviteCode(request.inviteCode()).orElseThrow(() -> new RuntimeException("Geçersiz Davet Kodu"));

        // Berber daha önceden başka kullanıcıyla eşleştirilmiş mi
        if(barber.claimed()) {
            throw new RuntimeException("Bu berber daha önce başkası ile eşleştirilmiş");
        }

        // Kullanıcı ile berberi eşleştirdik kullanıcıyı kayıt ediyoruzz
        BarberUserModel savedUser = this.saveNewUser(
                request.name(),
                request.email(),
                request.password(),
                barber.id() // requestte id bilgisi yok onu db den alıyoruz invite codea göre
        );

        // Claimed true yapmamız lazım artık
        // recordlar immutable olduğu için true değeriyle yeni bir kopya oluşturup onu kaydediyoruz
        berber_model updatedBarber = new berber_model(
                barber.id(),
                barber.name(),
                barber.location(),
                barber.rating(),
                barber.image(),
                barber.inviteCode(),
                true // claimed true yaptık
        );

         barberRepository.save(updatedBarber);

        return savedUser;
    }


    public String loginUser(String email, String rawPassword) {
        // Kullanıcıyı Bul
        BarberUserModel user = barberUserRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı"));

        // Şifreleri karşılaştır
        boolean isMatch = passwordEncoder.matches(rawPassword, user.password());

        if (!isMatch) {
            throw new RuntimeException("Hatalı şifre veya email");
        }

        return jwtService.generateToken(user.name(), user.email(), user.berberId());
    }
}

