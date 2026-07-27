import React, { useState, useEffect, useRef } from 'react';
import { branches } from '../data/branches';
import BranchCard from './BranchCard';
import BranchMap from './BranchMap';

export default function Branches() {
  const [activeBranchId, setActiveBranchId] = useState(null);
  const listRef = useRef(null);

  // Scroll to active card when activeBranchId changes
  useEffect(() => {
    if (!activeBranchId || !listRef.current) return;

    const index = branches.findIndex(b => b.id === activeBranchId);
    if (index === -1) return;

    const container = listRef.current;
    const cards = container.querySelectorAll('.branch-card');
    const card = cards[index];
    if (!card) return;

    // Scroll smoothly to make the active card reach the top of the container
    container.scrollTo({
      top: card.offsetTop - 10,
      behavior: 'smooth'
    });
  }, [activeBranchId]);

  const handleSelectBranch = (id) => {
    setActiveBranchId(id);
  };

  return (
    <section id="branches" className="branches-section">
      <div className="section-header">
        <span className="section-subtitle">Dónde encontrarnos</span>
        <h2 className="section-title">Nuestras Sucursales</h2>
        <div className="section-divider"></div>
      </div>

      <div className="branches-container">
        {/* Interactive Map (left on desktop, top on mobile) */}
        <div className="branches-map-wrapper">
          <BranchMap 
            activeBranchId={activeBranchId} 
            onSelectBranch={handleSelectBranch} 
          />
        </div>

        {/* Branches list (right on desktop, bottom on mobile) */}
        <div className="branches-list-wrapper" ref={listRef}>
          <div className="branches-list">
            {branches.map((branch) => (
              <BranchCard
                key={branch.id}
                branch={branch}
                isActive={activeBranchId === branch.id}
                onSelect={() => handleSelectBranch(branch.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
