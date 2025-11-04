import React from 'react';

const Footer = ({ mode }) => {
  return (
    <footer style={{
      padding: '1.5rem',
      textAlign: 'center',
      backgroundColor: mode === 'dark' ? 'var(--surface-dark)' : 'var(--surface-light)',
      color: mode === 'dark' ? 'var(--text-secondary-dark)' : 'var(--text-secondary-light)',
      borderTop: `1px solid ${mode === 'dark' ? 'var(--border-dark)' : 'var(--border-light)'}`,
      marginTop: '2rem',
      boxShadow: 'var(--shadow-sm)'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        fontSize: '0.95rem',
        fontFamily: "'Poppins', sans-serif"
      }}>
        <span>Copyright © 2024</span>
        <span style={{ margin: '0 0.25rem' }}>•</span>
        <span>Created by </span>
        <a
          href="https://vermaabhay734.github.io/abhay/"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: mode === 'dark' ? 'var(--primary-dark)' : 'var(--primary-light)',
            textDecoration: 'none',
            fontWeight: '600',
            transition: 'color 0.3s ease',
            background: mode === 'dark' ? 'var(--gradient-primary-dark)' : 'linear-gradient(135deg, #1a365d, #2563eb)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
          onMouseEnter={(e) => {
            e.target.style.opacity = '0.8';
          }}
          onMouseLeave={(e) => {
            e.target.style.opacity = '1';
          }}
        >
          Abhay
        </a>
      </div>
    </footer>
  );
};

export default Footer;