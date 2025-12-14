package com.moodai.config;

import com.moodai.service.JwtService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    private final byte[] key;

    public JwtAuthFilter(@Value("${jwt.secret}") String secret) {
        this.key = secret.getBytes(StandardCharsets.UTF_8);
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String header = request.getHeader(HttpHeaders.AUTHORIZATION);
        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring(7);
            try {
                Claims claims = Jwts.parserBuilder()
                        .setSigningKey(Keys.hmacShaKeyFor(key.length >= 32 ? key : padToLength(key, 32)))
                        .build()
                        .parseClaimsJws(token)
                        .getBody();
                String subject = claims.getSubject();
                Object rolesObj = claims.get("roles");
                Collection<SimpleGrantedAuthority> authorities = List.of();
                if (rolesObj instanceof List<?> list) {
                    authorities = list.stream().map(Object::toString).map(r -> new SimpleGrantedAuthority("ROLE_" + r)).collect(Collectors.toList());
                }
                SecurityContextHolder.getContext().setAuthentication(
                        new UsernamePasswordAuthenticationToken(subject, null, authorities)
                );
            } catch (Exception ignored) {
                // Invalid token; proceed without auth
            }
        }
        filterChain.doFilter(request, response);
    }

    private byte[] padToLength(byte[] original, int length) {
        byte[] out = new byte[length];
        for (int i = 0; i < length; i++) {
            out[i] = original[i % original.length];
        }
        return out;
    }
}


