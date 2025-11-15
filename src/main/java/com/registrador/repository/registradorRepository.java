package com.registrador.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.registrador.model.Carta;

@Repository
public interface registradorRepository extends JpaRepository<Carta, Long> {
}
