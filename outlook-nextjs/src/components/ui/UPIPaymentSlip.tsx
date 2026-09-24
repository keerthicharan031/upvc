'use client';

import QRCode from 'react-qr-code';

// Standard UPI deep-link so any UPI app (GPay, PhonePe, Paytm, BHIM) can scan and pay
const UPI_ID = 'QR919884307707-2485@unionbankofindia';
const UPI_NAME = 'OUTLOOK ENTERPRISES';
const UPI_URL = `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(UPI_NAME)}&cu=INR`;

export default function UPIPaymentSlip() {
  return (
    <section className="upi-slip-wrapper" style={{
      padding: '4rem 1.5rem',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      {/* The printed paper */}
      <div className="upi-slip-card" style={{
        background: '#f5f3ef',
        maxWidth: '420px',
        width: '100%',
        padding: '2.5rem 2rem 2rem',
        position: 'relative',
        boxShadow: '0 8px 40px rgba(0,0,0,0.45), 0 2px 8px rgba(0,0,0,0.25), inset 0 0 60px rgba(0,0,0,0.03)',
        transform: 'rotate(-0.4deg)',
      }}>
        {/* Faint paper grain overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(0,0,0,0.008) 1px, rgba(0,0,0,0.008) 2px)',
          pointerEvents: 'none',
        }} />

        {/* ===== BANK HEADER ===== */}
        <div style={{
          textAlign: 'center',
          marginBottom: '0.6rem',
          position: 'relative',
        }}>
          {/* Union Bank of India - Main line */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.6rem',
            marginBottom: '0.35rem',
          }}>
            <span style={{
              fontFamily: "'Noto Sans Devanagari', 'Mangal', sans-serif",
              fontSize: '1.05rem',
              fontWeight: 700,
              color: '#1a1a1a',
              lineHeight: 1.2,
            }}>
              यूनियन बैंक<br />
              <span style={{ fontSize: '0.6rem', fontWeight: 400, color: '#555' }}>ऑफ़ इंडिया</span>
            </span>

            {/* U logo shape */}
            <div style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              border: '2.5px solid #e44d26',
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'center',
              position: 'relative',
              overflow: 'hidden',
            }}>
              <div style={{
                width: 16,
                height: 20,
                borderRadius: '0 0 8px 8px',
                border: '2.5px solid #003d8f',
                borderTop: 'none',
              }} />
            </div>

            <span style={{
              fontSize: '1.1rem',
              fontWeight: 700,
              color: '#1a1a1a',
              fontFamily: 'Georgia, \'Times New Roman\', serif',
              lineHeight: 1.2,
            }}>
              Union Bank<br />
              <span style={{ fontSize: '0.72rem', fontWeight: 400, color: '#555' }}>of India</span>
            </span>
          </div>

          {/* Government tagline */}
          <div style={{
            fontSize: '0.52rem',
            color: '#777',
            letterSpacing: '0.02em',
            marginBottom: '0.5rem',
            display: 'flex',
            justifyContent: 'center',
            gap: '1.5rem',
          }}>
            <span>भारत सरकार का उपक्रम</span>
            <span>A Government of India Undertaking</span>
          </div>

          {/* Andhra & Corporation sub-logos */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '1rem',
            marginBottom: '1rem',
          }}>
            <div style={{
              border: '1px solid #ccc',
              borderRadius: '3px',
              padding: '0.25rem 0.6rem',
              fontSize: '0.6rem',
              color: '#444',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
              background: '#fff',
            }}>
              <span style={{ color: '#e44d26', fontWeight: 800, fontSize: '0.7rem' }}>₹</span>
              <span>
                <span style={{ fontFamily: "'Noto Sans Devanagari', sans-serif", fontSize: '0.55rem' }}>आन्ध्रा</span><br />
                Andhra
              </span>
            </div>
            <div style={{
              border: '1px solid #ccc',
              borderRadius: '3px',
              padding: '0.25rem 0.6rem',
              fontSize: '0.6rem',
              color: '#444',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
              background: '#fff',
            }}>
              <span style={{ fontSize: '0.75rem' }}>🏛️</span>
              <span>
                <span style={{ fontFamily: "'Noto Sans Devanagari', sans-serif", fontSize: '0.55rem' }}>कॉर्पोरेशन</span><br />
                Corporation
              </span>
            </div>
          </div>
        </div>

        {/* ===== COMPANY NAME & UPI ID ===== */}
        <div style={{
          textAlign: 'center',
          marginBottom: '1.25rem',
        }}>
          <p style={{
            fontSize: '0.95rem',
            fontWeight: 800,
            color: '#111',
            letterSpacing: '0.08em',
            marginBottom: '0.15rem',
            fontFamily: "'Arial', 'Helvetica', sans-serif",
          }}>
            OUTLOOK ENTERPRISES
          </p>
          <p style={{
            fontSize: '0.62rem',
            color: '#444',
            fontFamily: "'Courier New', monospace",
            letterSpacing: '0.02em',
          }}>
            {UPI_ID}
          </p>
        </div>

        {/* ===== REAL SCANNABLE QR CODE ===== */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '1.5rem',
        }}>
          <div className="upi-qr-wrap" style={{
            background: '#ffffff',
            padding: '12px',
            lineHeight: 0,
          }}>
            <QRCode
              value={UPI_URL}
              size={240}
              level="H"
              bgColor="#ffffff"
              fgColor="#000000"
            />
          </div>
        </div>

        {/* ===== BHIM UPI BRANDING ===== */}
        <div style={{
          textAlign: 'center',
          borderTop: '1px solid #ddd',
          paddingTop: '1rem',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.15rem',
          }}>
            {/* BHIM */}
            <div>
              <span style={{
                fontSize: '1.6rem',
                fontWeight: 900,
                color: '#1a1a1a',
                letterSpacing: '0.06em',
                fontFamily: "'Arial Black', 'Impact', sans-serif",
              }}>
                BHIM
              </span>
              <span style={{
                fontSize: '1.6rem',
                fontWeight: 900,
                color: '#e44d26',
                fontFamily: "'Arial Black', 'Impact', sans-serif",
              }}>
                ▸▸
              </span>
            </div>

            {/* Divider */}
            <div style={{
              width: '2px',
              height: '32px',
              background: '#bbb',
              margin: '0 0.5rem',
            }} />

            {/* UPI */}
            <div>
              <span style={{
                fontSize: '1.6rem',
                fontWeight: 900,
                color: '#1a1a1a',
                letterSpacing: '0.04em',
                fontFamily: "'Arial Black', 'Impact', sans-serif",
              }}>
                UPI
              </span>
              <span style={{
                fontSize: '1.6rem',
                fontWeight: 900,
                color: '#4CAF50',
                fontFamily: "'Arial Black', 'Impact', sans-serif",
              }}>
                ▸▸
              </span>
            </div>
          </div>

          {/* Sub text */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '1.2rem',
            marginTop: '0.15rem',
          }}>
            <span style={{
              fontSize: '0.38rem',
              fontWeight: 700,
              color: '#555',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
            }}>
              Bharat Interface for Money
            </span>
            <span style={{
              fontSize: '0.38rem',
              fontWeight: 700,
              color: '#555',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
            }}>
              Unified Payments Interface
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
