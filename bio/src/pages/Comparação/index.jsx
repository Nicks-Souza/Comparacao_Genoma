import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import './style.css';

function Comparacao() {
  const [fastaFiles, setFastaFiles] = useState([]);
  const [file1, setFile1] = useState('');
  const [file2, setFile2] = useState('');
  const [file1Content, setFile1Content] = useState('');
  const [file2Content, setFile2Content] = useState('');
  const [comparisonResult, setComparisonResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    const fetchFastaFiles = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/fasta');
        setFastaFiles(response.data);
      } catch (err) {
        console.error("Erro ao buscar arquivos FASTA:", err);
      }
    };

    fetchFastaFiles();
  }, []);

  // Efeito para resetar o resultado da comparação quando os arquivos forem alterados
  useEffect(() => {
    setComparisonResult(null);
    setError(null);
  }, [file1, file2]);

  const handleFileSelection = async (e, setFile, setFileContent) => {
    const fileId = e.target.value;
    setFile(fileId);
  
    if (fileId) {
      try {
        const response = await axios.get(`http://localhost:8080/api/fasta/${fileId}`);
  
        if (response.data && response.data.nome && response.data.fastaContent) {
          setFileContent(response.data.fastaContent);
        } else {
          setFileContent('');
        }
      } catch (error) {
        console.error("Erro ao carregar o conteúdo do arquivo:", error);
        setFileContent('');
      }
    } else {
      setFileContent('');
    }
  };

  const calculateNucleotidePairs = (sequence) => {
    const cont = { 'AA': 0, 'AT': 0, 'AC': 0, 'AG': 0, 'TA': 0, 'TT': 0, 'TC': 0, 'TG': 0, 'CA': 0, 'CT': 0, 'CC': 0, 'CG': 0, 'GA': 0, 'GT': 0, 'GC': 0, 'GG': 0 };
    sequence = sequence.replace(/\n/g, '');

    for (let k = 0; k < sequence.length - 1; k++) {
        const pair = sequence[k] + sequence[k + 1];
        if (cont[pair] !== undefined) {
            cont[pair] += 1;
        }
    }

    return cont;
  };

  const calculateDataForBarChart = (result1, result2, file1Name, file2Name) => {
    return Object.keys(result1).map(pair => ({
      name: pair,
      [file1Name]: result1[pair],
      [file2Name]: result2[pair],
    }));
  };

  const handleComparison = (event) => {
    event.preventDefault();
    setLoading(true);

    setTimeout(() => {
      if (file1Content && file2Content) {
        const result1 = calculateNucleotidePairs(file1Content);
        const result2 = calculateNucleotidePairs(file2Content);

        const file1Name = file1 ? fastaFiles.find(f => f.id === parseInt(file1)).nome : 'Amostra 1';
        const file2Name = file2 ? fastaFiles.find(f => f.id === parseInt(file2)).nome : 'Amostra 2';

        const barChartData = calculateDataForBarChart(result1, result2, file1Name, file2Name);
        setComparisonResult({ result1, result2, barChartData });
        setError(null);
      } else {
        setError('Por favor, selecione dois arquivos para comparar.');
      }
      setLoading(false);
    }, 3000);
  };

  const renderHeatmap = (result) => {
    const maxCount = Math.max(...Object.values(result));
    return (
      <div className="heatmap">
        {Object.entries(result).map(([pair, count], index) => {
          const opacity = count / maxCount;
          return (
            <div
              key={index}
              className="heatmap-cell"
              style={{ backgroundColor: `rgba(0, 0, 0, ${opacity})` }}
            >
              {pair}
            </div>
          );
        })}
      </div>
    );
  };

  const renderBarChart = (data) => (
    <BarChart width={600} height={400} data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey={data[0] ? Object.keys(data[0])[1] : 'Amostra1'} fill="rgb(171, 63, 63)" />
      <Bar dataKey={data[0] ? Object.keys(data[0])[2] : 'Amostra2'} fill="rgb(239, 180, 124)" />
    </BarChart>
  );

  return (
    <div className='barra'>
      <h2>Comparar Arquivos de DNA</h2>

      {loading ? (
        <div className="wrapper">
          <div className="loader">
            <div className="wave top-wave">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
            <div className="wave bottom-wave">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <form onSubmit={handleComparison}>
            <div>
              <label htmlFor="file1">Arquivo 1:</label>
              <select id="file1" value={file1} onChange={(e) => handleFileSelection(e, setFile1, setFile1Content)}>
                <option value="">Selecione um arquivo</option>
                {fastaFiles.map(file => (
                  <option key={file.id} value={file.id}>{file.nome}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="file2">Arquivo 2:</label>
              <select id="file2" value={file2} onChange={(e) => handleFileSelection(e, setFile2, setFile2Content)}>
                <option value="">Selecione um arquivo</option>
                {fastaFiles.map(file => (
                  <option key={file.id} value={file.id}>{file.nome}</option>
                ))}
              </select>
            </div>

            <button type="submit" className="btn btn-primary">Comparar</button>
          </form>

          {error && <p>{error}</p>}
          {comparisonResult && (
            <div className="comparison-results">
              <div className="result-section">
                <h4 className="nome1">{file1 ? fastaFiles.find(f => f.id === parseInt(file1)).nome : 'Arquivo 1'}</h4>
                {renderHeatmap(comparisonResult.result1)}
              </div>
              <div className="comparison-x">X</div>
              <div className="result-section">
                <h4 className='nome2'>{file2 ? fastaFiles.find(f => f.id === parseInt(file2)).nome : 'Arquivo 2'}</h4>
                {renderHeatmap(comparisonResult.result2)}
              </div>
            </div>
          )}

          {comparisonResult && (
            <div className="bar-chart">
              <h4>Comparação de Pares de Nucleotídeos entre as Amostras</h4>
              {renderBarChart(comparisonResult.barChartData)}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Comparacao;
