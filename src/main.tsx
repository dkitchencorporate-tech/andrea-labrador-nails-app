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
          background: '#FAF8F5', color: '#2d3a31', fontFamily: 'sans-serif',
          padding: '2rem', textAlign: 'center'
        }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>💅</div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            Andrea Labrador Nails Studio
          </h1>
          <p style={{ fontSize: '0.95rem', color: '#5a6e5e', marginBottom: '1rem', maxWidth: '380px' }}>
            Error de carga — diagnóstico:
          </p>
          <pre style={{
            fontSize: '0.7rem', color: '#c0392b', background: '#fff5f5',
            border: '1px solid #fcc', borderRadius: '8px',
            padding: '0.75rem', maxWidth: '90vw', overflow: 'auto',
            textAlign: 'left', marginBottom: '1.5rem', whiteSpace: 'pre-wrap'
          }}>
            {this.state.error}
          </pre>
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
