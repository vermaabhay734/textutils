import React from 'react';

const Logo = ({ mode }) => {
  const lightStyle = {
    color: 'var(--primary-light)',
    background: 'linear-gradient(135deg, #1a365d, #2563eb)',
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    fontWeight: '800'
  };

  const darkStyle = {
    color: 'var(--primary-dark)',
    background: 'var(--gradient-primary-dark)',
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      ...mode === 'dark' ? darkStyle : lightStyle
    }}>
      <svg 
        width="32" 
        height="32" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <path d="M14 2v6h6" />
        <path d="M9 13h6" />
        <path d="M9 17h6" />
        <path d="M9 9h1" />
      </svg>
      <span style={{
        fontSize: '1.5rem',
        fontWeight: '700',
        fontFamily: "'Poppins', sans-serif",
        letterSpacing: '-0.5px'
      }}>
        TextUtils
      </span>
    </div>
  );
};

export default Logo;