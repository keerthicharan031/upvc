'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface CompanyLogoProps {
  size?: number;
  showText?: boolean;
  className?: string;
}

export default function CompanyLogo({ size = 44, showText = true, className = '' }: CompanyLogoProps) {
  return (
    <Link
      href="/"
      aria-label="Outlook Enterprises Homepage"
      className={`company-logo-link ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.75rem',
        textDecoration: 'none',
        paddingLeft: '0.25rem',
        minWidth: '44px',
        minHeight: '44px',
        cursor: 'pointer',
        transition: 'transform 200ms ease',
      }}
    >
      <div
        className="company-logo-badge"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          minWidth: `${size}px`,
          minHeight: `${size}px`,
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          filter: 'drop-shadow(0 4px 12px rgba(245, 158, 11, 0.28))',
          transition: 'transform 200ms ease, filter 200ms ease',
        }}
      >
        <Image
          src="/logo.svg"
          alt="Outlook Enterprises Logo"
          width={size}
          height={size}
          priority
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
          }}
        />
      </div>

      {showText && (
        <span
          className="company-logo-text"
          style={{
            fontWeight: 800,
            fontSize: '1.05rem',
            letterSpacing: '-0.02em',
            color: 'var(--color-text-primary)',
            whiteSpace: 'nowrap',
          }}
        >
          OUTLOOK <span className="text-gradient">ENTERPRISES</span>
        </span>
      )}
    </Link>
  );
}
