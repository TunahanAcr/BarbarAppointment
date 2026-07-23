package com.berberapp.dashboard.service;

import com.berberapp.dashboard.controller.BarberUserController;
import com.berberapp.dashboard.model.BarberUserModel;
import com.berberapp.dashboard.model.BarberModel;
import com.berberapp.dashboard.repository.BarberUserRepository;
import com.berberapp.dashboard.repository.BarberRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.transaction.annotation.Transactional;

@Service
public class BarberUserService {

    @Value("${admin.code}")
    private String adminCode;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    private final BarberUserRepository barberUserRepository;
    private final BarberRepository barberRepository;
    private final JwtService jwtService;



    public BarberUserService(BarberUserRepository barberUserRepository, BarberRepository barberRepository, JwtService jwtService) {
        this.barberUserRepository = barberUserRepository;
        this.barberRepository = barberRepository;
        this.jwtService = jwtService;
    }

        public BarberUserModel saveNewUser(String name, String email, String password, String berberId, String role) {

        String hashedPassword = passwordEncoder.encode(password);

        BarberUserModel newUser = new BarberUserModel(null ,name, email, hashedPassword, berberId, role, java.time.Instant.now());

        return barberUserRepository.save(newUser);
    }

    @Transactional // İki farklı collectiona kayıt yapıyoruz birine yapıp öbüründe bağlantı koparsa sıkıntı çıkar bu yüzden ikisini aynı anda güncelle veya ikisini de güncelleme diyerek işlem bütünlüğü sağlıyoruz
    public BarberUserModel registerUserWithInviteCode (BarberUserController.SignupRequest request) {
        // Email zaten var mı kontrolü
        if (barberUserRepository.findByEmail(request.email()).isPresent()) {
            throw new RuntimeException("Bu email zaten kullanımda"); // Buralarda method bizden bir barbaruser modeli beklediği için hata çıkarsa throw fırlatıyoruz ki uygulama çökmesin
        }

        // Eğer admin codeuyla kayıt oluyorsa rolü admin yap berberId si arama
        if (request.inviteCode().equals(adminCode)) {

            // Kullanıcı ile berberi eşleştirdik kullanıcıyı kayıt ediyoruzz
            // this yazmasakta olur ama okunabilirlik açısından iyi bu classın metodu olduğunu belirtiyor
            BarberUserModel adminUser = this.saveNewUser(
                    request.name(),
                    request.email(),
                    request.password(),
                    null,// adminin berberId ye ihtiyacı yok
                    "ADMIN"
            );

            return adminUser;

        }


        // Kullanıcının girdiği inviteCode ile dükkanı bul
        BarberModel barber = barberRepository.findByInviteCode(request.inviteCode()).orElseThrow(() -> new RuntimeException("Geçersiz Davet Kodu"));

        // Berber daha önceden başka kullanıcıyla eşleştirilmiş mi
        if(barber.claimed()) {
            throw new RuntimeException("Bu berber daha önce başkası ile eşleştirilmiş");
        }


        // Claimed true yapmamız lazım artık
        // recordlar immutable olduğu için true değeriyle yeni bir kopya oluşturup onu kaydediyoruz
        BarberModel updatedBarber = new BarberModel(
                barber.id(),
                barber.name(),
                barber.location(),
                barber.rating(),
                barber.image(),
                barber.inviteCode(),
                true // claimed true yaptık
        );
        barberRepository.save(updatedBarber);

        // Kullanıcı ile berberi eşleştirdik kullanıcıyı kayıt ediyoruzz
        BarberUserModel savedUser = this.saveNewUser(
                request.name(),
                request.email(),
                request.password(),
                barber.id(), // requestte id bilgisi yok onu db den alıyoruz invite codea göre
                "USER" // Sadece doğru admin codeunu vilen admin olabilir onun dışında herkesi user yapıyoruz
        );

        return savedUser;
    }


    public String loginUser(String email, String rawPassword) {
        // Kullanıcıyı Bul
        BarberUserModel user = barberUserRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı"));

        // Şifreleri karşılaştır
        // Burda parolalar db ye kaydedilirken salt değeri de kaydedildiği için karşılaştırma yaparken o salt değerine göre yapar bu şekilde iki kullanıcı aynı password ile kayıt olsa bile hashlenmiş değerleri farklıdır
        boolean isMatch = passwordEncoder.matches(rawPassword, user.password());

        if (!isMatch) {
            throw new RuntimeException("Hatalı şifre veya email");
        }

        return jwtService.generateToken(user.name(), user.email(), user.berberId(), user.role());
    }
}

