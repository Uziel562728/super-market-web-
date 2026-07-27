import React from 'react';
import { useNavigate } from 'react-router-dom';
import { contactConfig, getWhatsAppLink } from '../data/contactConfig';

export default function ProductCard({ product, categories = [] }) {
  const navigate = useNavigate();
  const {
    nombre,
    precio,
    precio_anterior,
    imagen_principal,
    categoria_id,
    marca,
    descripcion,
    oferta,
    disponible
  } = product;

  const openProduct = () => {
    if (product.slug) navigate(`/${product.slug}`);
  };

  // Find category name
  const categoryInfo = categories.find(c => c.id === categoria_id);
  const categoryLabel = categoryInfo ? categoryInfo.nombre : 'Sin categoría';

  // Calculate discount percentage if previous price exists
  const discount = precio_anterior && precio_anterior > precio
    ? Math.round(((precio_anterior - precio) / precio_anterior) * 100)
    : 0;

  // Build WhatsApp text for this specific product
  const defaultWhatsApp = contactConfig.whatsAppNumbers.find(w => w.isDefault) || contactConfig.whatsAppNumbers[0];
  const queryMessage = `Hola Big Sale, quería consultar por el producto: *${nombre}* (${marca ? `marca ${marca}, ` : ''}Precio: $${precio.toLocaleString('es-AR')}). ¿Tienen disponibilidad?`;
  const whatsappUrl = getWhatsAppLink(defaultWhatsApp.numberApi, queryMessage);

  return (
    <div
      className={`product-card ${product.slug ? 'product-card-clickable' : ''} ${oferta ? 'product-on-sale' : ''} ${!disponible ? 'product-out-of-stock' : ''}`}
      onClick={openProduct}
      onKeyDown={(e) => {
        if (product.slug && (e.key === 'Enter' || e.key === ' ')) openProduct();
      }}
      role={product.slug ? 'link' : undefined}
      tabIndex={product.slug ? 0 : undefined}
    >
      {/* Badges */}
      <div className="product-badges">
        {oferta && <span className="badge-offer">🔥 OFERTA</span>}
        {discount > 0 && <span className="badge-discount">-{discount}%</span>}
        {!disponible && <span className="badge-stock">Sin Stock</span>}
      </div>

      {/* Image */}
      <div className="product-image-container">
        <img
          src={imagen_principal || 'https://via.placeholder.com/300?text=Producto'}
          alt={nombre}
          loading="lazy"
          className="product-image"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&auto=format&fit=crop&q=80'; // fallback grocery image
          }}
        />
      </div>

      {/* Content */}
      <div className="product-info">
        <div className="product-meta">
          <span className="product-brand">{marca || 'Genérico'}</span>
          <span className="product-category-tag">{categoryLabel}</span>
        </div>
        <h3 className="product-name" title={nombre}>{nombre}</h3>
        {descripcion && <p className="product-description">{descripcion}</p>}
        
        {/* Prices */}
        <div className="product-price-section">
          {precio_anterior && precio_anterior > precio && (
            <span className="price-old">${precio_anterior.toLocaleString('es-AR')}</span>
          )}
          <span className="price-current">${precio.toLocaleString('es-AR')}</span>
        </div>

        {/* Action Button */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-product-whatsapp"
          onClick={(e) => e.stopPropagation()}
        >
          <span className="ws-icon">💬</span>
          <span className="stock-label-full">Consultar Stock</span>
          <span className="stock-label-mobile">Consultar</span>
        </a>
      </div>
    </div>
  );
}
