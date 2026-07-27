import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { contactConfig, getWhatsAppLink } from '../data/contactConfig';
import Header from './Header';
import Footer from './Footer';

export default function ProductDetail() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      setNotFound(false);

      const { data, error } = await supabase
        .from('products')
        .select('*, categories(nombre)')
        .eq('slug', slug)
        .eq('disponible', true)
        .maybeSingle();

      if (error || !data) {
        if (error) console.error('No se pudo cargar el producto:', error);
        setProduct(null);
        setNotFound(true);
      } else {
        setProduct(data);
        setActiveImageIndex(0);
      }

      setLoading(false);
    };

    loadProduct();
    window.scrollTo(0, 0);
  }, [slug]);

  const pageContent = () => {
    if (loading) {
      return (
        <div className="product-detail-status">
          <div className="admin-spinner"></div>
          <p>Cargando producto...</p>
        </div>
      );
    }

    if (notFound) {
      return (
        <div className="product-detail-status product-not-found">
          <span className="not-found-code">404</span>
          <h1>Producto no encontrado</h1>
          <p>El producto no existe, no está disponible o cambió de dirección.</p>
          <Link to="/" className="btn btn-primary">Volver al catálogo</Link>
        </div>
      );
    }

    const defaultWhatsApp = contactConfig.whatsAppNumbers.find((item) => item.isDefault)
      || contactConfig.whatsAppNumbers[0];
    const message = `Hola Super Market Kosher, quería consultar por el producto: *${product.nombre}*.`;
    const whatsappUrl = getWhatsAppLink(defaultWhatsApp.numberApi, message);
    const additionalImages = Array.isArray(product.imagenes_adicionales)
      ? product.imagenes_adicionales
      : [];
    const gallery = [...new Set([product.imagen_principal, ...additionalImages].filter(Boolean))];
    const hasMultipleImages = gallery.length > 1;
    const showPreviousImage = () => {
      setActiveImageIndex((current) => (current - 1 + gallery.length) % gallery.length);
    };
    const showNextImage = () => {
      setActiveImageIndex((current) => (current + 1) % gallery.length);
    };

    return (
      <article className="product-detail-card">
        <div className="product-detail-gallery">
          {gallery.length > 0 ? (
            <>
              <div className="product-carousel-stage">
                {hasMultipleImages && (
                  <button
                    type="button"
                    className="product-carousel-arrow product-carousel-arrow-left"
                    onClick={showPreviousImage}
                    aria-label="Ver imagen anterior"
                  >
                    ‹
                  </button>
                )}
              <img
                  key={`${gallery[activeImageIndex]}-${activeImageIndex}`}
                  src={gallery[activeImageIndex]}
                  alt={`${product.nombre} - imagen ${activeImageIndex + 1}`}
                  className="product-carousel-image"
              />
                {hasMultipleImages && (
                  <button
                    type="button"
                    className="product-carousel-arrow product-carousel-arrow-right"
                    onClick={showNextImage}
                    aria-label="Ver imagen siguiente"
                  >
                    ›
                  </button>
                )}
              </div>
              {hasMultipleImages && (
                <div className="product-carousel-indicators" aria-label="Seleccionar imagen">
                  {gallery.map((image, index) => (
                    <button
                      key={`${image}-indicator`}
                      type="button"
                      className={`product-carousel-dot ${index === activeImageIndex ? 'active' : ''}`}
                      onClick={() => setActiveImageIndex(index)}
                      aria-label={`Mostrar imagen ${index + 1}`}
                      aria-current={index === activeImageIndex ? 'true' : undefined}
                    />
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="product-detail-no-image">Sin imagen</div>
          )}
        </div>

        <div className="product-detail-info">
          <Link to="/" className="product-detail-back">← Volver al catálogo</Link>
          <div className="product-detail-tags">
            {product.oferta && <span className="badge-offer">🔥 OFERTA</span>}
            <span className={`detail-stock ${product.disponible ? 'available' : 'unavailable'}`}>
              {product.disponible ? 'Disponible' : 'Sin stock'}
            </span>
          </div>
          {product.marca && <span className="product-detail-brand">{product.marca}</span>}
          <h1>{product.nombre}</h1>
          {product.categories?.nombre && (
            <span className="product-detail-category">{product.categories.nombre}</span>
          )}
          <div className="product-detail-prices">
            {product.precio_anterior > product.precio && (
              <span className="price-old">${Number(product.precio_anterior).toLocaleString('es-AR')}</span>
            )}
            <span className="price-current">${Number(product.precio).toLocaleString('es-AR')}</span>
          </div>
          {product.descripcion && <p className="product-detail-description">{product.descripcion}</p>}
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp btn-large">
            💬 Consultar por WhatsApp
          </a>
        </div>
      </article>
    );
  };

  return (
    <div className="app-container product-detail-page">
      <Header />
      <main className="product-detail-main">{pageContent()}</main>
      <Footer />
    </div>
  );
}
