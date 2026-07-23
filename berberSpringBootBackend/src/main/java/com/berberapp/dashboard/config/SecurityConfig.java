package com.berberapp.dashboard.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter; // EKLENDİ

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtFilter jwtFilter; // EKLENDİ

    // Constructor ile Inject ettik
    public SecurityConfig(JwtFilter jwtFilter) {
        this.jwtFilter = jwtFilter;
    }

    // Bunu sınıfların değil, metotların tepesine yazarız. İçerideki objeyi new kelimesiyle biz üretiriz, ayarlarını biz yaparız. Fonksiyon o objeyi return ettiğinde, Spring o hazır objeyi alıp RAM'e koyar.
    // Bean dedik uygulama çalıştığında spring enablewebsecurity ile güvenlik motorunu çalıştırır ve ona verdipimiz bu metodu kullanır
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/login", "/api/signup", "/error").permitAll()
                        .anyRequest().authenticated()
                )
                // Kendi yazdığımız filtreyi, Spring'in standart şifre sorma filtresinin ÖNÜNE koyuyoruz
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}