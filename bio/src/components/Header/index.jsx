import { Link } from "react-router-dom";
import './style.css';
import { useLocation } from "react-router-dom";
import { useState } from "react";
import jaleco from "../../assets/1925015.png";

function Header() {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header>
      <div className="logo-container">
        <img src={jaleco} alt="logo" />
      </div>
      <nav className={`menu ${isMenuOpen ? 'open' : ''}`}>
        <div className="menu-items">
          <Link to="/" className={location.pathname === "/" ? "active" : ""}>Principal</Link>
          <Link to="/cadastro" className={location.pathname === "/cadastro" ? "active" : ""}>Cadastro Genomas</Link>
          <Link to="/comparacao" className={location.pathname === "/comparacao" ? "active" : ""}>Comparação</Link>
          <Link to="/sobre" className={location.pathname === "/sobre" ? "active" : ""}>Sobre</Link>
        </div>
        {isMenuOpen && (
          <button className="menu-close" onClick={toggleMenu}>
            ×
          </button>
        )}
      </nav>
      {!isMenuOpen && (
        <button className="menu-toggle" onClick={toggleMenu}>
          ☰
        </button>
      )}
    </header>
  );
}

export default Header;
