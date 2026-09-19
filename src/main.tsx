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
          background: '#FAF8F5', color: '#2d3a31', fontFamily: 'system-ui, -apple-system, sans-serif',
          padding: '2rem', textAlign: 'center'
        }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>💅</div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#16291F' }}>
            Andrea Labrador Nails Studio
          </h1>
          <p style={{ fontSize: '0.9rem', color: '#4a5d52', marginBottom: '1.5rem', maxWidth: '360px', lineHeight: 1.5 }}>
            Estamos optimizando la experiencia de tu visita. Presiona el botón para actualizar de inmediato:
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button
              onClick={() => window.location.reload()}
              style={{
                background: '#3f564c', color: '#fff', border: 'none',
                borderRadius: '999px', padding: '0.75rem 2rem',
                fontSize: '0.9rem', fontWeight: 'bold', cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(63, 86, 76, 0.25)'
              }}
            >
              Actualizar App
            </button>
            <button
              onClick={() => {
                try {
                  caches.keys().then(keys => Promise.all(keys.map(k => caches.delete(k))));
                } catch {}
                window.location.reload();
              }}
              style={{
                background: '#fff', color: '#3f564c', border: '1px solid #3f564c',
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
