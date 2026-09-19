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
  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          background: '#FAF8F5', color: '#2d3a31', fontFamily: 'sans-serif',
          padding: '2rem', textAlign: 'center'
        }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>💅</div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            Andrea Labrador Nails Studio
          </h1>
          <p style={{ fontSize: '0.95rem', color: '#5a6e5e', marginBottom: '1.5rem', maxWidth: '380px' }}>
            La aplicación está cargando. Si ves esto, por favor recarga la página.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              background: '#3f564c', color: '#fff', border: 'none',
              borderRadius: '999px', padding: '0.75rem 2rem',
              fontSize: '0.9rem', fontWeight: 'bold', cursor: 'pointer'
            }}
          >
            Recargar
          </button>
          {import.meta.env.DEV && (
            <pre style={{ marginTop: '1rem', fontSize: '0.75rem', color: '#c0392b', maxWidth: '90vw', overflow: 'auto' }}>
              {this.state.error}
            </pre>
          )}
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
