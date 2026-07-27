import React from 'react';
import logoImg from '../images/logo_premium sin fondo.png';

export default function Hero() {
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section id="home" className="hero-section">
      <div className="hero-glow"></div>
      
      {/* Animated diagonal red background lines */}
      <div className="hero-diagonal-lines">
        <div className="diagonal-line line-1"></div>
        <div className="diagonal-line line-2"></div>
        <div className="diagonal-line line-3"></div>
        <div className="diagonal-line line-4"></div>
        <div className="diagonal-line line-5"></div>
        <div className="diagonal-line line-6"></div>
      </div>

      <div className="hero-container">
        <div className="hero-content">
          <div className="hero-logo-slot">
            <div className="hero-logo-wrapper">
              <img src={logoImg} alt="Big Sale" className="hero-logo-large" />
            </div>
          </div>
          <p className="hero-subtitle">
            El catálogo más completo con la mayor variedad de productos y los mejores precios del mercado. ¡Encontrá lo que buscás al precio que querés!
          </p>
          <div className="hero-actions">
            <button onClick={() => scrollToSection('catalog')} className="btn btn-primary btn-large">
              🛒 Ver Productos
            </button>
            <button onClick={() => scrollToSection('branches')} className="btn btn-secondary btn-large">
              📍 Ver Sucursales
            </button>
          </div>
          
          <div className="features-strip">
            <div className="feature-item">
              <span className="feature-icon">💰</span>
              <div className="feature-text">
                <strong>Super Precios</strong>
                <span>Ofertas imbatibles</span>
              </div>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🍎</span>
              <div className="feature-text">
                <strong>Máxima Variedad</strong>
                <span>Miles de productos</span>
              </div>
            </div>
            <div className="feature-item">
              <span className="feature-icon">📍</span>
              <div className="feature-text">
                <strong>Cerca Tuyo</strong>
                <span>5 Sucursales CABA</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
