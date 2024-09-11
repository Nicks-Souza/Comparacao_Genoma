import React from 'react';
import './Footer.css'; // Importando o arquivo CSS
import linkedinSvg from '../../assets/linkedin-brands-solid.svg';
import githubSvg from '../../assets/square-github-brands-solid.svg';
import whatsSvg from '../../assets/square-whatsapp-brands-solid.svg';

const Footer = () => {
  return (
    <footer className="footer">   
      <div className="social-icons">
        <a href="https://www.linkedin.com/in/nicolas-de-souza-862b50248/" target="_blank" rel="noopener noreferrer">
          <img className="social-icon" src={linkedinSvg} alt="LinkedIn" />
        </a>
        <a href="https://github.com/Nicks-Souza" target="_blank" rel="noopener noreferrer">
          <img className="social-icon" src={githubSvg} alt="GitHub" />
        </a>
        <a href="+5524993240203" target="_blank" rel="noopener noreferrer">
          <img className="social-icon" src={whatsSvg} alt="WhatsApp" />
        </a>
      </div>
      <p className="copyright">
        © 2024 Nicolas de Souza
      </p>
    </footer>
  );
};

export default Footer;
