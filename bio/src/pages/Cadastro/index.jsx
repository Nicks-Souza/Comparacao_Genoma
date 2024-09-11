import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import './style.css';

function Cadastro() {
  const [nome, setNome] = useState('');
  const [file, setFile] = useState(null);
  const [fastaFiles, setFastaFiles] = useState([]);
  const [enviado, setEnviado] = useState(false);

  // Função para validar o nome do arquivo
  const validateFileName = (fileName) => {
    const regex = /^[a-zA-Z0-9_.-]*$/;
    return regex.test(fileName);
  };

  // Função para validar o tipo de arquivo
  const isFastaFile = (file) => {
    return file && file.name.endsWith('.fasta');
  };

  // Função para verificar se o arquivo já foi carregado
  const isDuplicateFile = (fileName) => {
    return fastaFiles.some(fasta => fasta.nome === fileName);
  };

  // Função para manipular a mudança de arquivo
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (!selectedFile) return; // Retorna se nenhum arquivo foi selecionado

    if (!validateFileName(selectedFile.name)) {
      Swal.fire({
        icon: 'error',
        title: 'Erro',
        text: 'Nome do arquivo contém caracteres inválidos.',
      });
      return;
    }

    if (!isFastaFile(selectedFile)) {
      Swal.fire({
        icon: 'error',
        title: 'Erro',
        text: 'Por favor, faça o upload de um arquivo .fasta.',
      });
      return;
    }

    if (isDuplicateFile(selectedFile.name)) {
      Swal.fire({
        icon: 'error',
        title: 'Erro',
        text: 'Este arquivo já foi cadastrado.',
      });
      return;
    }

    setFile(selectedFile);
  };

  // Função para manipular o envio do formulário
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const formData = new FormData();
      formData.append('nome', nome);
      formData.append('fastaContentBase64', file);
  
      const response = await axios.post('http://localhost:8080/api/fasta/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      setFastaFiles([...fastaFiles, response.data]);
      setEnviado(true);
      setNome('');
      setFile(null);
  
      Swal.fire({
        icon: 'success',
        title: 'Sucesso',
        text: 'Arquivo enviado com sucesso!',
      });
  
    } catch (error) {
      console.log('Requisição com problemas', error);
  
      if (error.response && error.response.status === 409) {
        Swal.fire({
          icon: 'error',
          title: 'Erro',
          text: 'Erro ao enviar o arquivo. Nome igual, conteudo igual, ou nome .fasta igual ao que temos em nosso banco de dados, tente novamente com outra amostra.',
        });
      }
    }
  };

  // Hook para buscar os arquivos existentes
  useEffect(() => {
    const fetchFastaFiles = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/fasta');
        setFastaFiles(response.data);
      } catch (error) {
        console.error('Erro ao buscar arquivos fasta', error);
      }
    };

    fetchFastaFiles();
  }, [enviado]);

  return (
    <div className='container'>
      <h1>Cadastro de Genomas</h1>
      <h4>Arquivos existentes:</h4>
      {enviado && (
        <div className="alert success" role="alert">Enviado com sucesso! Confira abaixo a lista de cadastros:</div>
      )}
      {fastaFiles.length > 0 && (
        <ul className="list-group my-3">
          {fastaFiles.map((file) => (
            <li key={file.id} className="list-group-item">
              <strong>Nome do Arquivo:</strong> {file.nome}
            </li>
          ))}
        </ul>
      )}
      {!enviado && (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="nome">Nome:</label>
            <input
              type="text"
              id="nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="fastaFile">Arquivo .fasta:</label>
            <input
              type="file"
              id="fastaFile"
              onChange={handleFileChange}
              accept=".fasta"
              required
            />
          </div>
          <button type="submit" className="btn">Cadastrar</button>
        </form>
      )}
    </div>
  );
}

export default Cadastro;
