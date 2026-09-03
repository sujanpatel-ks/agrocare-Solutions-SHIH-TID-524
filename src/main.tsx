import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import i18n from './i18n';
import { I18nextProvider } from 'react-i18next';
import { AuthProvider } from './AuthProvider.tsx';
import { ErrorBoundary } from './components/ErrorBoundary';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

// Suppress benign Vite WebSocket error in preview environment
window.addEventListener('unhandledrejection', (event) => {
  if (event.reason && event.reason.message && event.reason.message.includes('WebSocket closed')) {
    event.preventDefault();
  }
});

const originalError = console.error;
console.error = (...args) => {
  if (args.length > 0 && typeof args[0] === 'string' && args[0].includes('failed to connect to websocket')) {
    return;
  }
  originalError(...args);
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <AuthProvider>
        <I18nextProvider i18n={i18n}>
          <App />
        </I18nextProvider>
      </AuthProvider>
    </ErrorBoundary>
  </StrictMode>,
);

// Register Service Worker for offline persistence & PWA functionality
serviceWorkerRegistration.register({
  onSuccess: () => {
    console.log('AgroCare AI is ready for offline operation via Service Worker.');
  },
  onUpdate: (registration) => {
    console.log('AgroCare AI has a new update available.');
  }
});

