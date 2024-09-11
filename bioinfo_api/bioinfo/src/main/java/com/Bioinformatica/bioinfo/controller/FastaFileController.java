package com.Bioinformatica.bioinfo.controller;

import java.nio.charset.StandardCharsets;
import java.util.List;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MaxUploadSizeExceededException;
import org.springframework.web.multipart.MultipartFile;

import com.Bioinformatica.bioinfo.entity.FastaFileEntity;
import com.Bioinformatica.bioinfo.repository.FastaFileRepository;
import com.Bioinformatica.bioinfo.service.FastaFileService;

    
   @RestController
   @RequestMapping("/api/fasta")
   @CrossOrigin(origins = "http://localhost:5173")
   public class FastaFileController {

    	@Autowired
        private FastaFileService fastaFileService;
        @Autowired
        private FastaFileRepository fastaFileRepository;
        

        private String calculateHash(String content) throws NoSuchAlgorithmException {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hashBytes = digest.digest(content.getBytes(StandardCharsets.UTF_8));
            return Base64.getEncoder().encodeToString(hashBytes);
        }

        @PostMapping("/upload")
        public ResponseEntity<FastaFileEntity> uploadFastaFile(
                @RequestPart("nome") String nome,
                @RequestPart("fastaContentBase64") MultipartFile fastaFile) {

            try {
                String content = new String(fastaFile.getBytes(), StandardCharsets.UTF_8);
                String hash = calculateHash(content);  // Calcula o hash do conteúdo

                // Verifica se o hash já existe
                if (fastaFileService.existsByHash(hash)) {
                    return ResponseEntity.status(HttpStatus.CONFLICT).body(null); // Retorna 409 se o hash já existir
                }

                FastaFileEntity fastaFileEntity = new FastaFileEntity(nome, content, hash);
                fastaFileService.saveFastaFile(fastaFileEntity);

                return ResponseEntity.ok(fastaFileEntity);
            } catch (IllegalArgumentException e) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body(null);
            } catch (Exception e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
            }
        }
    @ExceptionHandler(MaxUploadSizeExceededException.class)
    @ResponseStatus(HttpStatus.PAYLOAD_TOO_LARGE)
    public ResponseEntity<String> handleMaxSizeException(MaxUploadSizeExceededException exc) {
        return ResponseEntity.status(HttpStatus.PAYLOAD_TOO_LARGE).body("Arquivo muito grande! O tamanho máximo permitido é 50MB.");
    }

    @GetMapping
    public ResponseEntity<List<FastaFileEntity>> getAllFastaFiles() {
        System.out.println("Método getAllFastaFiles foi chamado");
        return ResponseEntity.ok(fastaFileRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<FastaFileEntity> getFastaFileById(@PathVariable Long id) {
        return fastaFileRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
