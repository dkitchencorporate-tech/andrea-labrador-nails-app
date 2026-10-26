import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: string }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: '' };
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error: error?.message || 'Error desconocido' };
  }
  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // Log full error for diagnosis
    console.error('[ErrorBoundary]', error.message, info.componentStack);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          background: '#FAF7F2', color: '#1E181A', fontFamily: 'system-ui, -apple-system, sans-serif',
          padding: '2rem', textAlign: 'center'
        }}>
          <div style={{ fontSize: '2.25rem', marginBottom: '1rem' }}>✨</div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#1E181A' }}>
            VANESEV
          </h1>
          <p style={{ fontSize: '0.9rem', color: '#6E6266', marginBottom: '1.5rem', maxWidth: '360px', lineHeight: 1.5 }}>
            Estamos actualizando la plataforma. Presiona el botón para continuar de inmediato:
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button
              onClick={() => window.location.reload()}
              style={{
                background: '#9E475B', color: '#fff', border: 'none',
                borderRadius: '999px', padding: '0.75rem 2rem',
                fontSize: '0.9rem', fontWeight: 'bold', cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(158, 71, 91, 0.25)'
              }}
            >
              Recargar Página
            </button>
            <button
              onClick={() => {
                try {
                  if ('serviceWorker' in navigator) {
                    navigator.serviceWorker.getRegistrations().then(regs => regs.forEach(r => r.unregister()));
                  }
                  caches.keys().then(keys => Promise.all(keys.map(k => caches.delete(k))));
                } catch {}
                window.location.reload();
              }}
              style={{
                background: '#fff', color: '#9E475B', border: '1px solid #9E475B',
                borderRadius: '999px', padding: '0.75rem 1.5rem',
                fontSize: '0.85rem', fontWeight: '600', cursor: 'pointer'
              }}
            >
              Limpiar Caché
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
