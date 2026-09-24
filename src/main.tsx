import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { UIProvider } from './ui';
import './index.css';

// progressive enhancement: reveal animations only apply when JS is running
document.documentElement.classList.add('js');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <UIProvider>
      <App />
    </UIProvider>
  </StrictMode>,
);
