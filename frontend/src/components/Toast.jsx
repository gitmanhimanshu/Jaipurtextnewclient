import { useState, useEffect } from 'react';

const Toast = ({ message, type = 'success', duration = 3000, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    setTimeout(() => setIsVisible(true), 10);
    
    // Auto close after duration
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => {
        if (onClose) onClose();
      }, 300); // Wait for exit animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getTypeStyles = () => {
    switch (type) {
      case 'error':
        return {
          backgroundColor: '#fee2e2',
          border: '1px solid #fecaca',
          color: '#b91c1c',
          icon: '⚠️'
        };
      case 'warning':
        return {
          backgroundColor: '#fef3c7',
          border: '1px solid #fde68a',
          color: '#b45309',
          icon: '⚠️'
        };
      default: // success
        return {
          backgroundColor: '#dcfce7',
          border: '1px solid #bbf7d0',
          color: '#15803d',
          icon: '✅'
        };
    }
  };

  const typeStyles = getTypeStyles();

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      zIndex: 9999,
      minWidth: '300px',
      maxWidth: '500px',
      padding: '1rem',
      borderRadius: '0.5rem',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      fontSize: '0.875rem',
      fontWeight: '500',
      transform: isVisible ? 'translateX(0)' : 'translateX(100%)',
      opacity: isVisible ? 1 : 0,
      transition: 'all 0.3s ease-in-out',
      ...typeStyles
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start' }}>
        <span style={{ marginRight: '0.75rem', fontSize: '1.25rem' }}>{typeStyles.icon}</span>
        <div style={{ flex: 1, paddingTop: '2px' }}>
          {message}
        </div>
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(() => {
              if (onClose) onClose();
            }, 300);
          }}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '1.25rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            padding: '0',
            marginLeft: '0.75rem',
            lineHeight: '1',
            color: 'inherit',
            opacity: 0.7,
            transition: 'opacity 0.2s'
          }}
          onMouseEnter={(e) => e.target.style.opacity = 1}
          onMouseLeave={(e) => e.target.style.opacity = 0.7}
        >
          ×
        </button>
      </div>
      {/* Progress bar */}
      <div style={{
        height: '3px',
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        borderRadius: '2px',
        marginTop: '0.75rem',
        overflow: 'hidden'
      }}>
        <div style={{
          height: '100%',
          width: '100%',
          backgroundColor: type === 'error' ? '#b91c1c' : type === 'warning' ? '#b45309' : '#15803d',
          animation: `shrink ${duration}ms linear forwards`,
          transformOrigin: 'left'
        }}></div>
      </div>
      <style>{`
        @keyframes shrink {
          from { transform: scaleX(1); }
          to { transform: scaleX(0); }
        }
      `}</style>
    </div>
  );
};

export default Toast;