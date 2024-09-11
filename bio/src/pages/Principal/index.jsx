import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './style.css';

function Principal() {
  const [genomes, setGenomes] = useState([]);

  useEffect(() => {
    // Fetch para buscar as amostras do backend
    fetch('http://localhost:8080/api/fasta')
      .then(response => response.json())
      .then(data => setGenomes(data))
      .catch(error => console.error('Erro ao carregar amostras:', error));
  }, []);

  return (
    <div className='principal'>
      <div className='intro'>
        <h3>Bem-vindo ao Site de Genomas</h3>
        <p>Explore a riqueza do mundo genômico e descubra como a comparação de genomas pode revelar segredos vitais para a ciência e medicina.</p>
      </div>
      
      <div className='destaque'>
        <h2>Por que a Comparação de Genomas é Importante?</h2>
        <p>A análise comparativa de genomas permite identificar variações genéticas, compreender doenças e desenvolver tratamentos personalizados. Este site foi criado para facilitar o acesso a ferramentas que permitem explorar essas informações cruciais de forma prática e eficiente.</p>
      </div>
      
      <div className='amostras'>
        <h2>Navegue Pelas Amostras</h2>
        <p>Explore diferentes genomas e veja como cada um possui seu propósito. Cada genoma é uma história única sobre os seres vivos. Veja as amostras que já temos disponíveis:</p>
        
        <div className='genome-links'>
          {genomes.length === 0 ? (
            <p>Carregando amostras...</p>
          ) : (
            genomes.map(genome => (
              <div key={genome.id} className='genome-link'>
                <Link to={`/amostra/${genome.id}`}>
                  {genome.nome}
                </Link>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Principal;
