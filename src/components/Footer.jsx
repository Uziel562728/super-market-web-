import React from 'react';
import { contactConfig, getWhatsAppLink } from '../data/contactConfig';
import logoImg from '../images/logo supermarket.webp';

export default function Footer() {
  const defaultWhatsApp = contactConfig.whatsAppNumbers.find(w => w.isDefault) || contactConfig.whatsAppNumbers[0];
  const whatsappUrl = getWhatsAppLink(defaultWhatsApp.numberApi, defaultWhatsApp.defaultMessage);

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
    <footer className="footer">
      <div className="footer-container">
        {/* Brand Info */}
        <div className="footer-brand">
          <div className="footer-logo">
            <img src={logoImg} alt="Super Market Kosher" className="logo-img-footer" />
          </div>
          <p className="footer-tagline">
            Tu supermercado de confianza en la Ciudad Autónoma de Buenos Aires. Variedad, calidad y las mejores ofertas cerca tuyo.
          </p>
          <div className="footer-whatsapp-badge">
            <span className="badge-dot"></span>
            <span>Atención Directa: <strong>{defaultWhatsApp.numberDisplay}</strong></span>
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer-links-group">
          <h4>Enlaces Rápidos</h4>
          <ul>
            <li><button onClick={() => scrollToSection('home')} className="footer-link">Inicio</button></li>
            <li><button onClick={() => scrollToSection('catalog')} className="footer-link">Catálogo de Productos</button></li>
            <li><button onClick={() => scrollToSection('branches')} className="footer-link">Nuestra Sucursal</button></li>
            <li><button onClick={() => scrollToSection('contact')} className="footer-link">Contacto</button></li>
          </ul>
        </div>

        {/* Support & Legal */}
        <div className="footer-links-group">
          <h4>Contacto</h4>
          <ul>
            <li>
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="footer-link ws-footer-link">
                💬 WhatsApp Ventas
              </a>
            </li>
            {contactConfig.socialMedia.instagrams && contactConfig.socialMedia.instagrams.map((ig) => (
              <li key={ig.id}>
                <a href={ig.url} target="_blank" rel="noopener noreferrer" className="footer-link ig-footer-link">
                  📸 Instagram {ig.label}
                </a>
              </li>
            ))}
            <li className="footer-text-muted">📍 Sucursal en Flores, CABA</li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Super Market Kosher. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}
