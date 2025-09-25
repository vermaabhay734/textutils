import React from "react";

function Alert(props) {
    const capitalize = (word) =>{
        const lower = word.toLowerCase();
        return lower.charAt(0).toUpperCase() + lower.slice(1);
    };
  return (
    <div style={{ height: '50px', position: 'sticky', top: '0', zIndex: 1000 }}>
      {props.alert && (
        <div
          style={{
            position: 'absolute',
            top: '1rem',
            left: '50%',
            transform: 'translateX(-50%)',
            minWidth: '300px',
            maxWidth: '90%',
            padding: '1rem 1.5rem',
            borderRadius: '12px',
            backgroundColor: props.alert.type === 'success' ? 'var(--success)' : 'var(--error)',
            color: '#ffffff',
            boxShadow: 'var(--shadow-lg)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            animation: 'slideDown 0.3s ease-out',
            border: '1px solid rgba(255,255,255,0.2)',
            zIndex: 1000
          }}
          role="alert"
        >
          <div style={{ 
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '1rem',
            fontWeight: '500'
          }}>
            {props.alert.type === 'success' ? '✅' : '⚠️'}
            <strong>{capitalize(props.alert.type)}</strong>: {props.alert.msg}
          </div>
        </div>
      )}
    </div>
  );
}

export default Alert;
