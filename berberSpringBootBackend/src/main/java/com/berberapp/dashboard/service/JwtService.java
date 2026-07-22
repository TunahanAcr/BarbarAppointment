package com.berberapp.dashboard.service;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;

@Service
public class JwtService {
    // Kriptografik imza için anahtar normalde .env den çek
    @Value("${jwt.secret}")
    private String secretKeyString;

    // Geçerlilik süresi ms cinsinden
    private static final long EXPIRATION_TIME = 86400000;

    private Key getSignInKey() {
        return Keys.hmacShaKeyFor(secretKeyString.getBytes(StandardCharsets.UTF_8));
    }

    public String generateToken(String name,String email, String berberId) {
        return Jwts.builder()
                .setSubject(email) // Tokenin sahibi
                .claim("name", name) // İçine gömdük
                .claim("berberId", berberId) // İçine gömdüğümüz bilgi
                .setIssuedAt(new Date()) // Veriliş Tarihi
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(getSignInKey()) // İmzaladığımız gizli anahtar
                .compact();
    }

    // Tokenin içinden subjecti yani emaili çıkarır
    public String extractEmail(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSignInKey())
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    // Token bizim imzamızla mı imzalanmış ve süresi dolmuş mu kontrolü
    public boolean isTokenValid(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(getSignInKey()).build().parseClaimsJws(token);
            return true; // Hata yoksa
        }
        catch(Exception e) {
            return false; // Geçersiz token
        }
    }
}
