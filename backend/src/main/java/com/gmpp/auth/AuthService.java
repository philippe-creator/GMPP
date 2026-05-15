package com.gmpp.auth;

import com.gmpp.auth.dto.AuthRequest;
import com.gmpp.auth.dto.AuthResponse;
import com.gmpp.auth.dto.RegisterRequest;
import com.gmpp.security.JwtService;
import com.gmpp.user.AppUser;
import com.gmpp.user.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public AuthResponse login(AuthRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.password())
        );
        AppUser user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new EntityNotFoundException("Utilisateur introuvable"));
        String token = jwtService.generateToken(user);
        return new AuthResponse(token, user.getId(), user.getFullName(), user.getEmail(), user.getRole());
    }

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new IllegalArgumentException("Email deja utilise");
        }

        AppUser user = AppUser.builder()
                .fullName(request.fullName())
                .employeeCode(request.employeeCode())
                .email(request.email())
                .password(passwordEncoder.encode(request.password()))
                .role(request.role())
                .specialties(request.specialties())
                .certifications(request.certifications())
                .active(request.active())
                .build();

        AppUser saved = userRepository.save(user);
        String token = jwtService.generateToken(saved);
        return new AuthResponse(token, saved.getId(), saved.getFullName(), saved.getEmail(), saved.getRole());
    }
}

