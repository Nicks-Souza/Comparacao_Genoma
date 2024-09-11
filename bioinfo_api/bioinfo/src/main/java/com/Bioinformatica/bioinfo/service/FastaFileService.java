package com.Bioinformatica.bioinfo.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.Bioinformatica.bioinfo.entity.FastaFileEntity;
import com.Bioinformatica.bioinfo.repository.FastaFileRepository;

@Service
public class FastaFileService {

    @Autowired
    private FastaFileRepository fastaFileRepository;

    public FastaFileEntity saveFastaFile(FastaFileEntity fastaFile) {
        Optional<FastaFileEntity> existingFile = fastaFileRepository.findByNome(fastaFile.getNome());
        if (existingFile.isPresent()) {
            throw new IllegalArgumentException("Nome duplicado");
        }

        Optional<FastaFileEntity> existingHashFile = fastaFileRepository.findByHash(fastaFile.getHash());
        if (existingHashFile.isPresent()) {
            throw new IllegalArgumentException("Conteúdo duplicado");
        }

        return fastaFileRepository.save(fastaFile);
    }

    public boolean existsByHash(String hash) {
        return fastaFileRepository.findByHash(hash).isPresent();
    }

    public List<FastaFileEntity> getAllFastaFiles() {
        return fastaFileRepository.findAll();
    }

    public FastaFileEntity getFastaFileById(Long id) {
        return fastaFileRepository.findById(id).orElse(null);
    }

    public void deleteFastaFile(Long id) {
        fastaFileRepository.deleteById(id);
    }
}
