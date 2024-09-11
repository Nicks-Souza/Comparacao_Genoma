package com.Bioinformatica.bioinfo.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;

@Entity
public class FastaFileEntity {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	private String nome;
	
	private String hash; 

	@Lob // Utiliza a anotação @Lob para armazenar conteúdo de arquivos grandes
	private String fastaContent;
	

	// Construtores, getters e setters

	public FastaFileEntity() {
	}

	public FastaFileEntity(String nome, String fastaContent, String hash) {
		this.nome = nome;
		this.fastaContent = fastaContent;
		this.hash = hash;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getNome() {
		return nome;
	}

	public void setNome(String nome) {
		this.nome = nome;
	}

	public String getFastaContent() {
		return fastaContent;
	}

	public void setFastaContent(String fastaContent) {
		this.fastaContent = fastaContent;
	}
	
	public String getHash() {
        return hash;
    }

    public void setHash(String hash) {
        this.hash = hash;
    }

}
