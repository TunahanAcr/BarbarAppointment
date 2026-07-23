package com.berberapp.dashboard.config;

import com.berberapp.dashboard.service.JwtService;
import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

// Spring Boot ayağa kalkarken projeyi tarar. Başında @Component (veya @Service, @RestController) gördüğü sınıflardan kendi kendine bir tane obje (new JwtFilter()) üretir ve bunu RAM'e koyar.
//SecurityConfig içinde private final JwtFilter jwtFilter dediğimde, Spring RAM'de hazır bekleyen o objeyi bulur ve otomatik olarak oraya kabloyla bağlar (Dependency Injection) bir daha new JwtFilter() yazmak gerekmez
@Component //
public class JwtFilter extends OncePerRequestFilter { // Frontendden gelen her request için bir kez bunu çalıştır demek

    private final JwtService jwtService;

    public JwtFilter(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @Override
    // doFilterInternal OncePerRequestFilter dan miras alınır
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
    throws ServletException, IOException  { // İnternet kopabilir ya da sunucu tıkanabilir hatalarını önceden yazıyoruz
        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String userEmail;

        if (authHeader == null || !authHeader.startsWith("Bearer")) {
            filterChain.doFilter(request,response);
            return;
        }

        jwt = authHeader.substring(7);

        try {
            if(jwtService.isTokenValid(jwt)) {
                Claims claims = jwtService.extractAllClaims(jwt);

                request.setAttribute("userEmail", claims.getSubject());
                request.setAttribute("role", claims.get("role", String.class));

                String role = (String) request.getAttribute("role");

                List<GrantedAuthority> authorities = List.of(new SimpleGrantedAuthority(role));

                if(request.getAttribute("userEmail") != null && SecurityContextHolder.getContext().getAuthentication() == null) { // Bu kişi daha önceden securtycontexte kaydedilmiş mi kontrolü
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            request.getAttribute("userEmail"), null, authorities // principal, credential, authorities
                    );

                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request)); // o anki IP adresini, Tarayıcı bilgisini ve Oturum (Session) ID'sini alır tokenle birlikte

                    SecurityContextHolder.getContext().setAuthentication(authToken); // security context holdera requesti atan kişiyi kaydediyoruz
                }
            }
        }

        catch (Exception e) {
            System.out.println("Token Doğrulama Hatası: " + e.getMessage());
        }

        filterChain.doFilter(request,response); // nodejs teki next() in karşılığı
    }
}
