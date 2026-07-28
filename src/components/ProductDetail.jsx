import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { contactConfig, getWhatsAppLink } from '../data/contactConfig';
import Header from './Header';
import Footer from './Footer';
import { useCart } from '../context/CartContext';

export default function ProductDetail() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const { cart, addToCart, updateQuantity } = useCart();
  const navigate = useNavigate();

  const handleBack = (e) => {
    e.preventDefault();
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      setNotFound(false);
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

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
      // Ensure we are at the top once the DOM updates with product details
      setTimeout(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      }, 0);
    };

    loadProduct();
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


    const cartItem = cart.find((item) => item.product.id === product.id);
    const quantity = cartItem ? cartItem.quantity : 0;
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
          <a href="/" onClick={handleBack} className="product-detail-back">← Volver al catálogo</a>
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
          {/* Action Button / Quantity Selector */}
          <div className="product-detail-action-container">
            <button
              type="button"
              className={`btn btn-primary btn-large btn-detail-add-cart ${quantity > 0 ? 'inactive' : 'active'}`}
              disabled={!product.disponible}
              onClick={() => {
                if (product.disponible) {
                  addToCart(product);
                }
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle' }}><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
              Agregar al Carrito
            </button>

            {product.disponible && (
              <div className={`detail-qty-selector ${quantity > 0 ? 'active' : 'inactive'}`}>
                <button
                  type="button"
                  className="qty-btn"
                  onClick={() => updateQuantity(product.id, quantity - 1)}
                  aria-label="Disminuir cantidad"
                >
                  -
                </button>
                <span className="qty-val">{quantity}</span>
                <button
                  type="button"
                  className="qty-btn"
                  onClick={() => updateQuantity(product.id, quantity + 1)}
                  aria-label="Aumentar cantidad"
                >
                  +
                </button>
              </div>
            )}
          </div>
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
