package com.registrador.controller;

import com.registrador.model.Carta;
import com.registrador.service.registradorService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/cartas")
@CrossOrigin(origins = "*")
public class registradorController {

    @Autowired
    private registradorService service;

    @GetMapping
    public List<Carta> listar() {
        return service.listarCartas();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Carta> buscarPorId(@PathVariable Long id) {
        return service.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/buscar")
    public List<Carta> buscarPorNome(@RequestParam String nome) {
        return service.buscarPorNome(nome);
    }

    @PostMapping
    public ResponseEntity<Carta> criar(@RequestBody Carta carta) {
        Carta salva = service.salvar(carta);
        return ResponseEntity.ok(salva);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Carta> atualizar(
            @PathVariable Long id,
            @RequestBody Carta cartaAtualizada) {

        Carta carta = service.atualizar(id, cartaAtualizada);

        if (carta == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(carta);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        if (service.buscarPorId(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        service.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
