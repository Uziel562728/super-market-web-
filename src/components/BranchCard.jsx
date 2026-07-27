import React from 'react';
import { isKosherClosedForShabat } from '../data/branches';

export default function BranchCard({ branch, isActive, onSelect }) {
  const { nombre, direccion, googleMapsUrl, isKosher } = branch;
  const isClosedForShabat = isKosher && isKosherClosedForShabat();

  return (
    <div 
      className={`branch-card ${isActive ? 'active' : ''} ${isClosedForShabat ? 'branch-shabat-closed' : ''}`}
      onClick={onSelect}
    >
      <div className="branch-card-header">
        <span className="branch-card-icon">📍</span>
        <h3 className="branch-card-title">{nombre}</h3>
        {branch.isNew && (
          <span className="branch-new-badge">Nueva Sucursal</span>
        )}
        {isClosedForShabat && (
          <span className="branch-shabat-badge">⚠️ Cerrado por Shabat</span>
        )}
      </div>
      <p className="branch-card-address">{direccion}</p>
      
      <div className="branch-card-actions" onClick={(e) => e.stopPropagation()}>
        <a 
          href={googleMapsUrl} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="btn-branch btn-branch-maps"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
          </svg>
          Ver en Google Maps
        </a>
      </div>
    </div>
  );
}
