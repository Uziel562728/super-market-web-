import React from 'react';
import { contactConfig, getWhatsAppLink } from '../data/contactConfig';
import { isKosherClosedForShabat } from '../data/branches';

export default function Contact() {
  const defaultWhatsApp = contactConfig.whatsAppNumbers.find(w => w.isDefault) || contactConfig.whatsAppNumbers[0];
  const whatsappUrl = getWhatsAppLink(defaultWhatsApp.numberApi, defaultWhatsApp.defaultMessage);
  const isShabat = isKosherClosedForShabat();

  return (
    <section id="contact" className="contact-section">
      <div className="section-header">
        <span className="section-subtitle">Atención al cliente</span>
        <h2 className="section-title">Ponete en Contacto</h2>
        <div className="section-divider"></div>
      </div>

      <div className="contact-container">
        <div className="contact-info-card">
          <div className="contact-brand-title">SUPER MARKET KOSHER</div>
          <p className="contact-description">
            ¿Tenés alguna duda o consulta sobre nuestros productos o sucursales? Escribinos directamente por WhatsApp y te responderemos a la brevedad.
          </p>

          <div className="contact-methods">
            {/* WhatsApp Method */}
            <div className="contact-method-item">
              <span className="method-icon ws-color">💬</span>
              <div className="method-details">
                <strong>WhatsApp Ventas / Consultas</strong>
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="method-link">
                  {defaultWhatsApp.numberDisplay}
                </a>
              </div>
            </div>

            {/* Instagram Methods (Dynamic) */}
            {contactConfig.socialMedia.instagrams && contactConfig.socialMedia.instagrams.length > 0 ? (
              contactConfig.socialMedia.instagrams.map((ig) => (
                <div key={ig.id} className="contact-method-item">
                  <span className="method-icon ig-color">📸</span>
                  <div className="method-details">
                    <strong>Instagram {ig.label}</strong>
                    <a 
                      href={ig.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="method-link ig-link"
                    >
                      Ver perfil
                    </a>
                  </div>
                </div>
              ))
            ) : (
              <div className="contact-method-item disabled-method">
                <span className="method-icon ig-color">📸</span>
                <div className="method-details">
                  <strong>Instagram</strong>
                  <span className="method-placeholder">Próximamente @supermarketkosher.ar</span>
                </div>
              </div>
            )}

            <div className="contact-method-item disabled-method">
              <span className="method-icon mail-color">📧</span>
              <div className="method-details">
                <strong>Correo Electrónico</strong>
                <span className="method-placeholder">Próximamente consultas@supermarketkosher.com.ar</span>
              </div>
            </div>
          </div>

          <div className="contact-cta-wrapper">
            <a 
              href={whatsappUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn btn-whatsapp btn-large"
            >
              💬 Enviar Mensaje de WhatsApp
            </a>
          </div>
        </div>

        {/* Informative Side Card */}
        <div className="contact-hours-card">
          <h3>Horarios de Atención</h3>
          <div className="hours-list">
            <div className="hours-item">
              <span>Lunes a Viernes:</span>
              <strong>08:30 a 20:30 hs</strong>
            </div>
            <div className={`hours-item ${isShabat ? 'active-shabat-hours' : ''}`}>
              <span>Viernes:</span>
              {isShabat ? (
                <strong className="shabat-highlight">⚠️ Cierre a las 15:00 hs (Shabat)</strong>
              ) : (
                <strong>Cierre a las 15:00 hs (Shabat)</strong>
              )}
            </div>
            <div className="hours-item">
              <span>Sábados:</span>
              <strong className={isShabat ? 'shabat-highlight' : ''}>Cerrado por Shabat</strong>
            </div>
            <div className="hours-item">
              <span>Domingos:</span>
              <strong>09:00 a 14:00 hs</strong>
            </div>
          </div>
          <div className="contact-promo-footer">
            🏪 ¡Te esperamos en cualquiera de nuestras sucursales en CABA!
          </div>
        </div>
      </div>
    </section>
  );
}
