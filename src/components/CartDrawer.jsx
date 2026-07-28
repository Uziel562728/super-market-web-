import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { contactConfig, getWhatsAppLink } from '../data/contactConfig';

export default function CartDrawer() {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    cartTotal,
    cartCount,
    isCartOpen,
    setIsCartOpen,
    clearCart
  } = useCart();

  const navigate = useNavigate();

  // Form states
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [shippingMethod, setShippingMethod] = useState('retiro'); // 'retiro' or 'envio'
  const [street, setStreet] = useState('');
  const [floor, setFloor] = useState('');
  const [dept, setDept] = useState('');
  const [errors, setErrors] = useState({});

  // Animation states
  const [removingItems, setRemovingItems] = useState([]);
  const [isClearingAll, setIsClearingAll] = useState(false);

  const handleUpdateQuantity = (productId, newQty) => {
    if (newQty <= 0) {
      setRemovingItems((prev) => [...prev, productId]);
      setTimeout(() => {
        updateQuantity(productId, 0);
        setRemovingItems((prev) => prev.filter((id) => id !== productId));
      }, 300);
    } else {
      updateQuantity(productId, newQty);
    }
  };

  const handleRemoveFromCart = (productId) => {
    setRemovingItems((prev) => [...prev, productId]);
    setTimeout(() => {
      removeFromCart(productId);
      setRemovingItems((prev) => prev.filter((id) => id !== productId));
    }, 300);
  };

  const handleClearCart = () => {
    setIsClearingAll(true);
    const duration = 300 + cart.length * 50;
    setTimeout(() => {
      clearCart();
      setIsClearingAll(false);
    }, duration);
  };

  const handleClose = () => {
    setIsCartOpen(false);
  };

  const validateForm = () => {
    const tempErrors = {};
    if (!name.trim()) tempErrors.name = 'El nombre es obligatorio';
    if (!phone.trim()) tempErrors.phone = 'El teléfono es obligatorio';
    
    if (shippingMethod === 'envio') {
      if (!street.trim()) tempErrors.street = 'La calle con altura es obligatoria';
    }
    
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleCheckout = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Get default WhatsApp number
    const defaultWhatsApp = contactConfig.whatsAppNumbers.find(w => w.isDefault) || contactConfig.whatsAppNumbers[0];
    
    // Format product list
    const itemsText = cart.map(item => {
      const brandText = item.product.marca ? ` (${item.product.marca})` : '';
      const subtotal = item.product.precio * item.quantity;
      return `- ${item.quantity}x ${item.product.nombre}${brandText} - $${item.product.precio.toLocaleString('es-AR')} c/u (Subtotal: $${subtotal.toLocaleString('es-AR')})`;
    }).join('\n');

    // Format address info
    let addressText = '';
    if (shippingMethod === 'envio') {
      addressText = `\nDIRECCION DE ENVIO:\n- Calle y altura: ${street}\n${floor.trim() ? `- Piso: ${floor}\n` : ''}${dept.trim() ? `- Depto: ${dept}\n` : ''}`;
    }

    // Compose final message without emojis
    const message = `NUEVO PEDIDO - SUPER MARKET KOSHER
-----------------------------------------
Cliente: ${name}
Telefono: ${phone}
Metodo: ${shippingMethod === 'envio' ? 'Envio a Domicilio' : 'Retiro en Sucursal'}
${addressText}-----------------------------------------
PRODUCTOS:
${itemsText}

-----------------------------------------
Total a pagar: $${cartTotal.toLocaleString('es-AR')}
-----------------------------------------
Hola! Quiero confirmar este pedido.`;

    const whatsappUrl = getWhatsAppLink(defaultWhatsApp.numberApi, message);
    
    // Open in new window
    window.open(whatsappUrl, '_blank');
    
    // Close cart
    handleClose();
  };

  return (
    <div className={`cart-drawer-overlay ${isCartOpen ? 'active' : ''}`} onClick={handleClose}>
      <div className="cart-drawer-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="cart-drawer-header">
          <div className="cart-header-title">
            <svg className="cart-header-icon-svg" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
            <h2>Mi Carrito</h2>
            <span className="cart-badge">{cartCount}</span>
          </div>
          <div className="cart-header-actions">
            {cart.length > 0 && (
              <button 
                type="button" 
                className="cart-clear-btn" 
                onClick={handleClearCart}
              >
                Vaciar
              </button>
            )}
            <button 
              type="button" 
              className="cart-close-btn" 
              onClick={handleClose}
              aria-label="Cerrar carrito"
            >
              &times;
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="cart-drawer-body">
          {cart.length === 0 ? (
            <div className="cart-empty">
              <svg className="cart-empty-icon-svg" xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
              <h3>Tu carrito está vacío</h3>
              <p>Agrega productos desde nuestro catálogo para realizar un pedido.</p>
              <button 
                type="button" 
                className="btn btn-primary"
                onClick={handleClose}
              >
                Ver productos
              </button>
            </div>
          ) : (
            <>
              {/* Product List */}
              <div className="cart-items-list">
                {cart.map((item, index) => {
                  const product = item.product;
                  const isRemoving = removingItems.includes(product.id);
                  const isClearing = isClearingAll;
                  const delay = isClearing ? `${index * 50}ms` : '0ms';

                  return (
                    <div 
                      className={`cart-item ${isRemoving ? 'removing' : ''} ${isClearing ? 'clearing' : ''}`} 
                      key={product.id}
                      style={{ transitionDelay: delay }}
                    >
                      <div 
                        className="cart-item-img-container" 
                        onClick={() => navigate(`/${product.slug}`)}
                        style={{ cursor: 'pointer' }}
                        title="Ver detalle del producto"
                      >
                        <img 
                          src={product.imagen_principal || 'https://via.placeholder.com/100?text=Producto'} 
                          alt={product.nombre}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=150&auto=format&fit=crop&q=80';
                          }}
                        />
                      </div>
                      <div className="cart-item-details">
                        <div className="cart-item-meta">
                          <span className="cart-item-brand">{product.marca || 'Genérico'}</span>
                        </div>
                        <h4 
                          className="cart-item-name" 
                          onClick={() => navigate(`/${product.slug}`)}
                          style={{ cursor: 'pointer' }}
                          title="Ver detalle del producto"
                        >
                          {product.nombre}
                        </h4>
                        <div className="cart-item-pricing">
                          <span className="cart-item-price-each">
                            ${product.precio.toLocaleString('es-AR')}
                          </span>
                          <span className="cart-item-subtotal">
                            Subtotal: ${(product.precio * item.quantity).toLocaleString('es-AR')}
                          </span>
                        </div>
                        
                        <div className="cart-item-actions">
                          {/* Quantity Selector */}
                          <div className="cart-qty-selector">
                            <button 
                              type="button"
                              className="qty-btn"
                              onClick={() => handleUpdateQuantity(product.id, item.quantity - 1)}
                              aria-label="Disminuir cantidad"
                            >
                              -
                            </button>
                            <span className="qty-val">{item.quantity}</span>
                            <button 
                              type="button"
                              className="qty-btn"
                              onClick={() => updateQuantity(product.id, item.quantity + 1)}
                              aria-label="Aumentar cantidad"
                            >
                              +
                            </button>
                          </div>
                          
                          {/* Remove Button */}
                          <button 
                            type="button"
                            className="cart-item-remove"
                            onClick={() => handleRemoveFromCart(product.id)}
                            aria-label="Eliminar producto"
                          >
                            Eliminar
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Checkout Form */}
              <form className="cart-checkout-form" onSubmit={handleCheckout}>
                <h3>Datos de Entrega</h3>
                
                <div className="form-group">
                  <label htmlFor="cart-name">Nombre completo *</label>
                  <input 
                    id="cart-name"
                    type="text" 
                    placeholder="Ej: Juan Pérez"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={errors.name ? 'input-error' : ''}
                  />
                  {errors.name && <span className="error-text">{errors.name}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="cart-phone">Teléfono de contacto *</label>
                  <input 
                    id="cart-phone"
                    type="tel" 
                    placeholder="Ej: 11 2345-6789"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={errors.phone ? 'input-error' : ''}
                  />
                  {errors.phone && <span className="error-text">{errors.phone}</span>}
                </div>

                {/* Delivery Method Selector */}
                <div className="form-group">
                  <label>Método de entrega</label>
                  <div className="delivery-methods">
                    <button
                      type="button"
                      className={`method-btn ${shippingMethod === 'retiro' ? 'active' : ''}`}
                      onClick={() => setShippingMethod('retiro')}
                    >
                      <svg className="method-icon-svg" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                      <span className="method-label">Retiro en Sucursal</span>
                    </button>
                    <button
                      type="button"
                      className={`method-btn ${shippingMethod === 'envio' ? 'active' : ''}`}
                      onClick={() => setShippingMethod('envio')}
                    >
                      <svg className="method-icon-svg" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
                      <span className="method-label">Envío a Domicilio</span>
                    </button>
                  </div>
                </div>

                {/* Conditional Shipping Fields */}
                {shippingMethod === 'envio' && (
                  <div className="shipping-fields animated fadeIn">
                    <div className="form-group">
                      <label htmlFor="cart-street">Calle con altura *</label>
                      <input 
                        id="cart-street"
                        type="text" 
                        placeholder="Ej: Av. Corrientes 1234"
                        value={street}
                        onChange={(e) => setStreet(e.target.value)}
                        className={errors.street ? 'input-error' : ''}
                      />
                      {errors.street && <span className="error-text">{errors.street}</span>}
                    </div>

                    <div className="form-row">
                      <div className="form-group col">
                        <label htmlFor="cart-floor">Piso</label>
                        <input 
                          id="cart-floor"
                          type="text" 
                          placeholder="Ej: 3"
                          value={floor}
                          onChange={(e) => setFloor(e.target.value)}
                        />
                      </div>
                      <div className="form-group col">
                        <label htmlFor="cart-dept">Departamento</label>
                        <input 
                          id="cart-dept"
                          type="text" 
                          placeholder="Ej: B"
                          value={dept}
                          onChange={(e) => setDept(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Summary & Checkout Action */}
                <div className="cart-summary">
                  <div className="summary-row">
                    <span>Subtotal</span>
                    <span>${cartTotal.toLocaleString('es-AR')}</span>
                  </div>
                  <div className="summary-row total">
                    <span>Total estimado</span>
                    <span>${cartTotal.toLocaleString('es-AR')}</span>
                  </div>
                </div>

                <button type="submit" className="btn-cart-checkout">
                  <svg viewBox="0 0 448 512" width="18" height="18" fill="currentColor" className="btn-whatsapp-icon-svg" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '6px' }}><path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L3 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7 .9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/></svg>
                  Confirmar Pedido por WhatsApp
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
