'use client';

import React from 'react';

interface CinematicBackgroundProps {
  opacity?: number;
  className?: string;
}

export default function CinematicBackground({ className = '' }: CinematicBackgroundProps) {
  return (
    <div
      className={`cinematic-bg ${className}`}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100vh',
        zIndex: -1,
        pointerEvents: 'none',
        backgroundColor: 'var(--color-bg)',
        transition: 'background-color 0.3s ease',
      }}
    />
  );
}

