package com.gmpp.user;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public List<AppUser> findAll() {
        return userRepository.findAll();
    }

    public List<AppUser> findByRole(Role role) {
        return userRepository.findByRole(role);
    }

    public List<AppUser> findActiveTechnicians() {
        return userRepository.findActiveTechnicians();
    }

    public AppUser findById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Utilisateur introuvable: " + id));
    }

    @Transactional
    public AppUser update(Long id, UpdateUserRequest req) {
        AppUser user = findById(id);
        user.setFullName(req.fullName());
        user.setEmail(req.email());
        user.setRole(req.role());
        user.setSpecialties(req.specialties());
        user.setCertifications(req.certifications());
        user.setPhone(req.phone());
        user.setDepartment(req.department());
        user.setActive(req.active());
        return userRepository.save(user);
    }

    @Transactional
    public void deactivate(Long id) {
        AppUser user = findById(id);
        user.setActive(false);
        userRepository.save(user);
    }

    @Transactional
    public void activate(Long id) {
        AppUser user = findById(id);
        user.setActive(true);
        userRepository.save(user);
    }
}
