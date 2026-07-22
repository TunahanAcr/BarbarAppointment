package com.berberapp.dashboard.service;

import com.berberapp.dashboard.controller.BarberUserController;
import com.berberapp.dashboard.model.BarberUserModel;
import com.berberapp.dashboard.model.berber_model;
import com.berberapp.dashboard.repository.BarberUserRepository;
import com.berberapp.dashboard.repository.BarberRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class BarberUserService {
    private final BarberUserRepository barberUserRepository;
    private final BarberRepository barberRepository;

    public BarberUserService(BarberUserRepository barberUserRepository, BarberRepository barberRepository) {
        this.barberUserRepository = barberUserRepository;
        this.barberRepository = barberRepository;
    }

    public Optional<BarberUserModel> isEmailExist(String email) {
        return barberUserRepository.findByEmail(email);
        }

    public BarberUserModel saveNewUser(String name, String email, String password, String berberId) {
        BarberUserModel newUser = new BarberUserModel(null ,name, email, password, berberId, java.time.Instant.now());
        return barberUserRepository.save(newUser);
    }

    public Optional<BarberUserModel> findUser(String email) {
        return barberUserRepository.findByEmail(email);
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


}

