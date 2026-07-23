package com.berberapp.dashboard.service;

import io.jsonwebtoken.Claims;
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
    // Application propertiesten secret keyi okur ve alttaki değişkene yapıştırır
    @Value("${jwt.secret}")
    private String secretKeyString;

    // Geçerlilik süresi ms cinsinden
    private static final long EXPIRATION_TIME = 86400000;

    //  Java da key secret key bu şekilde bytelara çevirip key objesine dönüştürmek gerek
    private Key getSignInKey() {
        return Keys.hmacShaKeyFor(secretKeyString.getBytes(StandardCharsets.UTF_8));
    }

    public String generateToken(String name,String email, String berberId, String role) {
        return Jwts.builder()
                .setSubject(email) // Tokenin sahibi
                .claim("name", name) // İçine gömdük
                .claim("berberId", berberId) // İçine gömdüğümüz bilgi
                .claim("role", role )
                .setIssuedAt(new Date()) // Veriliş Tarihi
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(getSignInKey()) // İmzaladığımız gizli anahtar
                .compact();
    }

    // Tokenin içinden subjecti yani emaili çıkarır
    public Claims extractAllClaims(String token) {
        return Jwts.parserBuilder() // Şifrelenmiş tokeni geri açar
                .setSigningKey(getSignInKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public String extractEmail(String token) {
        return extractAllClaims(token).getSubject();
    }

    public String extractRole(String token) {
        return extractAllClaims(token).get("role", String.class);
    }

    // Token bizim imzamızla mı imzalanmış ve süresi dolmuş mu kontrolü
    public boolean isTokenValid(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(getSignInKey()).build().parseClaimsJws(token); // Bir karakter bile değişmişse parseClaims hata fırlatır
            return true; // Hata yoksa
        }
        catch(Exception e) {
            return false; // Geçersiz token
        }
    }
}
