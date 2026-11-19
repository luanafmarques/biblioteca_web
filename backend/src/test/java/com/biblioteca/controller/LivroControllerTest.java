package com.biblioteca.controller;

import com.biblioteca.model.Autor;
import com.biblioteca.model.Livro;
import com.biblioteca.repository.AutorRepository;
import com.biblioteca.repository.LivroRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(LivroController.class)
class LivroControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private LivroRepository livroRepository;

    @MockBean
    private AutorRepository autorRepository;

    private Autor autor() {
        return new Autor(1L, "Machado de Assis", "Brasileira", null, null);
    }

    @Test
    void deveCriarLivroComSucesso() throws Exception {
        Autor refAutor = new Autor();
        refAutor.setId(1L);
        Livro livro = new Livro(null, "Dom Casmurro", "978-8535910667", 1899, "Romance", refAutor, null);
        Livro salvo = new Livro(1L, "Dom Casmurro", "978-8535910667", 1899, "Romance", autor(), null);

        when(autorRepository.findById(1L)).thenReturn(Optional.of(autor()));
        when(livroRepository.save(any(Livro.class))).thenReturn(salvo);

        mockMvc.perform(post("/api/livros")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(livro)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.titulo").value("Dom Casmurro"))
                .andExpect(jsonPath("$.autor.nome").value("Machado de Assis"));
    }

    @Test
    void deveRetornar404ParaIdInexistente() throws Exception {
        when(livroRepository.findById(99L)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/livros/99"))
                .andExpect(status().isNotFound());
    }

    @Test
    void deveRetornar400QuandoSemAutor() throws Exception {
        Livro livro = new Livro(null, "Sem Autor", null, null, null, null, null);

        mockMvc.perform(post("/api/livros")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(livro)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void deveListarLivrosOrdenados() throws Exception {
        when(livroRepository.findAllByOrderByTituloAsc()).thenReturn(List.of(
                new Livro(2L, "Dom Casmurro", null, 1899, "Romance", autor(), null),
                new Livro(1L, "Memórias Póstumas de Brás Cubas", null, 1881, "Romance", autor(), null)));

        mockMvc.perform(get("/api/livros"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].titulo").value("Dom Casmurro"))
                .andExpect(jsonPath("$[1].titulo").value("Memórias Póstumas de Brás Cubas"));
    }
}
