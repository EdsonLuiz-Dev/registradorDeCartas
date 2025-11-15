package com.registrador.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.registrador.model.Carta;
import com.registrador.repository.registradorRepository;

import java.util.List;
import java.util.Optional;

@Service
public class registradorService {

    @Autowired
    private registradorRepository repository;

    public List<Carta> listarCartas() {
        return repository.findAll();
    }

    public Optional<Carta> buscarPorId(Long id) {
        return repository.findById(id);
    }

    public List<Carta> buscarPorNome(String nome) {
        return repository.findByNomeContainingIgnoreCase(nome);
    }

    public Carta salvar(Carta carta) {
        return repository.save(carta);
    }

    public Carta atualizar(Long id, Carta cartaAtualizada) {
        return repository.findById(id).map(carta -> {
            carta.setNome(cartaAtualizada.getNome());
            carta.setCmc(cartaAtualizada.getCmc());
            carta.setCor(cartaAtualizada.getCor());
            carta.setTipo(cartaAtualizada.getTipo());
            carta.setTexto(cartaAtualizada.getTexto());
            carta.setPoder(cartaAtualizada.getPoder());
            carta.setResistencia(cartaAtualizada.getResistencia());
            return repository.save(carta);
        }).orElse(null);
    }

    public void deletar(Long id) {
        repository.deleteById(id);
    }
}
