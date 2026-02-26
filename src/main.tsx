import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { LanguageProvider } from './LanguageContext';
import './index.css';

const rootElement = document.getElementById('root');

if (!rootElement) {
  console.error('Root element with id "root" not found in index.html');
} else {
  createRoot(rootElement).render(
    <StrictMode>
      <LanguageProvider>
        <App />
      </LanguageProvider>
    </StrictMode>
  );
}
