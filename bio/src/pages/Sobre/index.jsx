import React from 'react';
import './style.css';
import foto_Nicolas from '../../assets/foto_Nicolas.jpeg';

function Sobre() {
  return (
    <div className='sobre'>
      <h1>Um pouco sobre mim e o site:</h1>
      <div className='sobre-container'>
        <img src={foto_Nicolas} alt='Minha foto' className='sobre-imagem' />
        <div className='sobre-texto'>
          <p>Olá! Eu sou o Nicolas, um entusiasta da biologia e desenvolvedor web. Criei este site como uma maneira de unir duas paixões: a programação e a exploração do fascinante mundo da biologia.</p>
          <p>Este site é meu espaço para aprofundar e organizar minhas ideias, ao mesmo tempo que compartilho essa jornada de aprendizado. Estou amando cada momento, e espero que essa paixão seja contagiante para quem explorar o conteúdo aqui.</p>
          <p>Seja bem-vindo(a) e sinta-se à vontade para explorar e aprender junto comigo!</p>
        </div>
      </div>
    </div>
  );
}

export default Sobre;