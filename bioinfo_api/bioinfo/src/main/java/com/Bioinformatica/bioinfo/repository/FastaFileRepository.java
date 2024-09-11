package com.Bioinformatica.bioinfo.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.Bioinformatica.bioinfo.entity.FastaFileEntity;

@Repository
public interface FastaFileRepository extends JpaRepository<FastaFileEntity, Long> {
	Optional<FastaFileEntity> findByNome(String nome);
	Optional<FastaFileEntity> findByHash(String hash);
}